import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";

type LoaderData = {
    widget: Widget;
    voteType: "thumbsup" | "thumbsdown";
    voteId: string;
};

type UnparsedWidget = {
    userId: string;
    widgetId: string;
    widgetType: string;
    followupQuestions: string;
};

type Widget = {
    userId: string;
    widgetId: string;
    widgetType: string;
    followupQuestions: FollowupQuestion[];
};

type FollowupQuestion = {
    label: string;
    id: number;
    type: "text" | "boolean";
};

const client = new GraphQLClient(
    "https://56v8170tv6.execute-api.us-east-1.amazonaws.com/graphql"
);

const fetchWidgetQuery = gql`
    query {
        allWidget {
            userId
            widgetId
            widgetType
            followupQuestions
        }
    }
`;

// TODO: add support for fetching individual widgetId on server
async function fetchWidget(widgetId: string): Promise<Widget | null> {
    const data: { allWidget: UnparsedWidget[] } = await client.request(
        fetchWidgetQuery
    );

    const widget = data.allWidget.find(
        (widget) => widget.widgetId === widgetId
    );

    if (widget) {
        return {
            ...widget,
            followupQuestions: JSON.parse(widget.followupQuestions as string),
        };
    } else {
        return null;
    }
}

const saveVoteMutation = gql`
    mutation widgetVote(
        $userId: String!
        $widgetId: String!
        $thumbsup: Boolean
        $thumbsdown: Boolean
        $voter: String
        $instanceOfJoy: String
    ) {
        widgetVote(
            userId: $userId
            widgetId: $widgetId
            thumbsup: $thumbsup
            thumbsdown: $thumbsdown
            voter: $voter
            instanceOfJoy: $instanceOfJoy
        ) {
            voteId
        }
    }
`;

async function saveVote(
    widget: Widget,
    voteType: "thumbsup" | "thumbsdown",
    voter?: string | null,
    instanceOfJoy?: string | null
) {
    const variables = {
        userId: widget.userId,
        widgetId: widget.widgetId,
        thumbsup: voteType === "thumbsup",
        thumbsdown: voteType === "thumbsdown",
        voter,
        instanceOfJoy,
    };

    const data: { widgetVote: { voteId: string } } = await client.request(
        saveVoteMutation,
        variables
    );

    return data.widgetVote.voteId;
}

export const loader: LoaderFunction = async ({ params, request }) => {
    // 404 if wrong URL
    if (
        !params.widgetId ||
        (params.voteType !== "thumbsup" && params.voteType !== "thumbsdown")
    ) {
        throw new Response("Not found", { status: 404 });
    }

    // fetches metadata about the thing that was feedbacked
    const widget = await fetchWidget(params.widgetId);
    if (!widget) {
        throw new Response("Not found", { status: 404 });
    }

    // get query params
    const url = new URL(request.url);
    const voter = url.searchParams.get("voter");
    const instanceOfJoy = url.searchParams.get("instanceOfJoy");

    // saves initial thumbsup/down vote
    const voteId = await saveVote(
        widget,
        params.voteType,
        voter,
        instanceOfJoy
    );

    return {
        widget,
        voteType: params.voteType,
        voteId,
    };
};

const Question = (props: FollowupQuestion) => {
    return (
        <div>
            <label>{props.label}</label>
            <input type="text" name={`field_${props.id}`}></input>
        </div>
    );
};

export default function FeedbackRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <>
            <h1>
                {data.voteType === "thumbsup"
                    ? `👍 You liked Swizec's ${data.widget.widgetType} 👍`
                    : `👎 You didn't like Swizec's ${data.widget.widgetType} 👎`}
            </h1>
            <form
                method="post"
                action={`/${data.widget.widgetId}/saveFeedback`}
            >
                {data.widget.followupQuestions.map((q) => (
                    <Question {...q} key={q.id} />
                ))}

                <input type="hidden" name="voteId" value={data.voteId} />
                <input type="hidden" name="voteType" value={data.voteType} />

                <button type="submit">Submit</button>
            </form>
        </>
    );
}
