import { LoaderFunction, useLoaderData } from "remix";
import { gql, GraphQLClient } from "graphql-request";

type LoaderData = {
    followupQuestions: FollowupQuestion[];
};

type Widget = {
    userId: string;
    widgetId: string;
    widgetType: string;
    followupQuestions: string;
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
async function fetchFollowupQuestions(
    widgetId: string
): Promise<FollowupQuestion[]> {
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

    const data: { allWidget: Widget[] } = await client.request(query);

    const widget = data.allWidget.find(
        (widget) => widget.widgetId === widgetId
    );

    if (widget) {
        return JSON.parse(widget.followupQuestions);
    }

    return [];
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.widgetId) {
        return null;
    }

    const followupQuestions = await fetchFollowupQuestions(params.widgetId);

    return {
        followupQuestions,
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
        <form>
            {data.followupQuestions.map((q) => (
                <Question {...q} />
            ))}
        </form>
    );
}
