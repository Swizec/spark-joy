import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";
import { Box, Button, Heading, Input, Label, Paragraph } from "theme-ui";

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

// TODO: add support for fetching individual widgetId on GraphQL server
async function fetchWidget(
    client: GraphQLClient,
    widgetId: string
): Promise<Widget | null> {
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
    client: GraphQLClient,
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

    const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

    // fetches metadata about the thing that was feedbacked
    const widget = await fetchWidget(client, params.widgetId);
    if (!widget) {
        throw new Response("Not found", { status: 404 });
    }

    // get query params
    const url = new URL(request.url);
    const voter = url.searchParams.get("voter");
    const instanceOfJoy = url.searchParams.get("instanceOfJoy");

    // saves initial thumbsup/down vote
    const voteId = await saveVote(
        client,
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
    const fieldName = `field_${props.id}`;

    return (
        <Box sx={{ mb: 3 }}>
            <Label>{props.label}</Label>
            <Input type="text" name={fieldName} autoComplete="off"></Input>
        </Box>
    );
};

export default function FeedbackRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <>
            <Heading as="h1">
                {data.voteType === "thumbsup"
                    ? `👍 You liked Swizec's ${data.widget.widgetType} 👍`
                    : `👎 You didn't like Swizec's ${data.widget.widgetType} 👎`}
            </Heading>
            <form
                method="post"
                action={`/${data.widget.widgetId}/saveFeedback`}
            >
                <Paragraph sx={{ textAlign: "center", py: 2 }}>
                    Got 2min to answer 3 questions and help him out? all
                    optional :)
                </Paragraph>
                {data.widget.followupQuestions.map((q) => (
                    <Question {...q} key={q.id} />
                ))}

                <input type="hidden" name="voteId" value={data.voteId} />
                <input type="hidden" name="voteType" value={data.voteType} />

                <Box sx={{ textAlign: "center" }}>
                    <Button type="submit" sx={{ my: 2 }}>
                        Give Feedback
                    </Button>
                </Box>
            </form>
        </>
    );
}
