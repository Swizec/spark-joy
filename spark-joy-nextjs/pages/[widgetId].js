import * as React from "react";
import Head from "next/head";
import { Container, Heading } from "theme-ui";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { FullScreenForm } from "../components/FullScreenForm";

const client = new ApolloClient({
    uri: "https://ahe5za5z07.execute-api.us-east-1.amazonaws.com/dev/graphql",
    cache: new InMemoryCache(),
});

export async function getServerSideProps({ params }) {
    const { widgetId } = params;
    const { data } = await client.query({
        query: gql`
            query {
                allWidget {
                    userId
                    widgetId
                    widgetType
                    followupQuestions
                }
            }
        `,
    });

    // TODO: support a query to fetch this directly
    const widget = data.allWidget.find((w) => w.widgetId === widgetId) || {};

    return { props: { widget } };
}

const ThankYouView = () => (
    <>
        <img src="https://media.giphy.com/media/QAsBwSjx9zVKoGp9nr/giphy.gif" />
        <Heading sx={{ fontSize: [3, 4, 5] }}>
            ❤️️️ Thank you, you're the best! ❤️
        </Heading>
    </>
);

const VoteTypeHeading = ({ voteType, widgetType }) =>
    voteType === "thumbsup" ? (
        <Heading fontSize={[5, 6, 7]}>
            👍 you enjoyed Swizec's {widgetType} 👍
        </Heading>
    ) : (
        <Heading fontSize={[5, 6, 7]}>
            👎 you didn't enjoy Swizec's {widgetType} 👎
        </Heading>
    );

const FormView = ({ voteType, onSubmit, followupQuestions, widgetType }) => (
    <>
        <VoteTypeHeading voteType={voteType} widgetType={widgetType} />
        <FullScreenForm
            onSubmit={onSubmit}
            followupQuestions={followupQuestions}
        />
    </>
);

const VotePage = ({ widget }) => {
    // const apolloClient = useApolloClient();
    const {
        userId,
        widgetId,
        voteType,
        followupQuestions,
        widgetType,
    } = widget;

    const [showThankYou, setShowThankYou] = React.useState(false);
    // const voteId = useSaveVote({ userId, widgetId, voteType });

    async function onSubmit(answers) {
        // if (Object.values(answers).length >= followupQuestions.length) {
        //     setShowThankYou(true);
        // }
        // await apolloClient.mutate({
        //     mutation: SAVE_WIDGET_FEEDBACK_QUERY,
        //     variables: {
        //         widgetId,
        //         voteId,
        //         voteType,
        //         answers: JSON.stringify(answers),
        //     },
        // });
    }

    return (
        <Container sx={{ textAlign: "center" }}>
            <Head>
                <title>Thank you</title>
            </Head>

            {showThankYou ? (
                <ThankYouView />
            ) : (
                <FormView
                    voteType={voteType}
                    onSubmit={onSubmit}
                    followupQuestions={followupQuestions}
                    widgetType={widgetType}
                />
            )}
        </Container>
    );
};

export default VotePage;
