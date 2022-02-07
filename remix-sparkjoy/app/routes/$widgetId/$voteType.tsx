import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";

type LoaderData = {
    widget: Widget;
    voteType: "thumbsup" | "thumbsdown";
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

// TODO: add support for fetching individual widgetId on server
async function fetchWidget(widgetId: string): Promise<Widget | null> {
    const query = gql`
        query {
            allWidget {
                userId
                widgetId
                widgetType
                followupQuestions
            }
        }
    `;

    const data: { allWidget: UnparsedWidget[] } = await client.request(query);

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

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.widgetId) {
        return null;
    }

    const widget = await fetchWidget(params.widgetId);

    if (
        !widget ||
        (params.voteType !== "thumbsup" && params.voteType !== "thumbsdown")
    ) {
        throw new Response("Not found", { status: 404 });
    }

    return {
        widget,
        voteType: params.voteType,
    };
};

const Question = (props: FollowupQuestion) => {
    return (
        <div>
            <label>{props.label}</label>
            <input type="text"></input>
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
            <form>
                {data.widget.followupQuestions.map((q) => (
                    <Question {...q} key={q.id} />
                ))}
            </form>
        </>
    );
}
