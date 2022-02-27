import { gql, GraphQLClient } from "graphql-request";
import { ActionFunction, redirect } from "remix";

const saveFeedbackMutation = gql`
    mutation saveFeedback(
        $widgetId: String!
        $voteId: String!
        $voteType: String!
        $answers: String!
        $createdAt: String
    ) {
        saveFeedback(
            widgetId: $widgetId
            voteId: $voteId
            voteType: $voteType
            answers: $answers
            createdAt: $createdAt
        ) {
            answers
        }
    }
`;

const client = new GraphQLClient(
    "https://56v8170tv6.execute-api.us-east-1.amazonaws.com/graphql"
);

// saves feedback to server
async function saveFeedback(widgetId: string, formData: FormData) {
    const answers = Object.fromEntries(
        // filter hidden fields from formData
        Array.from(formData).filter(
            ([name, value]) => name !== "voteId" && name !== "voteType"
        )
    );

    const variables = {
        widgetId,
        voteId: formData.get("voteId"),
        voteType: formData.get("voteType"),
        answers: JSON.stringify(answers),
    };

    await client.request(saveFeedbackMutation, variables);
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.widgetId) {
        throw new Response("Not found", { status: 404 });
    }

    const formData = await request.formData();

    await saveFeedback(params.widgetId, formData);

    return redirect(`/${params.widgetId}/saveFeedback`);
};

export default function SaveFeedback() {
    return <h1>Thanks! You're the best ❤️</h1>;
}
