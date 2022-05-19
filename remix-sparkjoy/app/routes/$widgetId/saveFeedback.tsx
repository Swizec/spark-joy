import { gql, GraphQLClient } from "graphql-request";
import { ActionFunction, redirect } from "remix";
import { Heading } from "theme-ui";

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

// saves feedback to server
async function saveFeedback(
    client: GraphQLClient,
    widgetId: string,
    formData: FormData
) {
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

    const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

    const formData = await request.formData();

    await saveFeedback(client, params.widgetId, formData);

    return redirect(`/${params.widgetId}/saveFeedback`);
};

export default function SaveFeedback() {
    return <Heading as="h1">Thanks! You're the best ❤️</Heading>;
}
