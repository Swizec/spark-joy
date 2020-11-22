import * as React from "react";
import Head from "next/head";
import { Container, Heading } from "theme-ui";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { FullScreenForm } from "../../components/FullScreenForm";

const client = new ApolloClient({
    uri: "https://ahe5za5z07.execute-api.us-east-1.amazonaws.com/dev/graphql",
    cache: new InMemoryCache(),
});

// fetches all widgets from DB
// a widget is a type of thumbsup/down vote thingy
async function getWidgets() {
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
    // const widget = data.allWidget.find((w) => w.widgetId === widgetId) || {};

    return data.allWidget;
}

// saves user's vote to the database
async function saveVote({ userId, widgetId, voteType, voter, instanceOfJoy }) {
    const { data } = await client.mutate({
        mutation: gql`
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
        `,
        variables: {
            userId,
            widgetId,
            thumbsup: voteType === "thumbsup",
            thumbsdown: voteType === "thumbsdown",
            voter,
            instanceOfJoy,
        },
    });
}

// dynamically get props on every page load
// use this opportunity to save the vote
export async function getServerSideProps({ params, query }) {
    const { widgetId, voteType } = params;
    const { voter, instanceOfJoy } = query;

    const widgets = await getWidgets();
    const widget = widgets.find((w) => w.widgetId === widgetId) || {};

    await saveVote({
        userId: widget.userId,
        widgetId,
        voteType,
        voter,
        instanceOfJoy,
    });

    return {
        props: { widget, voteType },
    };
}

// static props about the widget you're voting on
// export async function getStaticProps({ params }) {
//     const { widgetId, voteType } = params;

//     const widgets = await getWidgets();
//     const widget = widgets.find((w) => w.widgetId === widgetId) || {};

//     return {
//         props: { widget, voteType },
//     };
// }

// generate static vote pages for each widget type in DB
// export async function getStaticPaths() {
//     const widgets = await getWidgets();

//     function makePaths(voteType) {
//         return widgets.map((widget) => ({
//             params: {
//                 widgetId: widget.widgetId,
//                 voteType,
//             },
//         }));
//     }

//     return {
//         paths: [...makePaths("thumbsup"), ...makePaths("thumbsdown")],
//         fallback: false,
//     };
// }

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

const VotePage = ({ widget, voteType }) => {
    // const apolloClient = useApolloClient();
    const { userId, widgetId, followupQuestions, widgetType } = widget;

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
