import { LoaderFunction, useLoaderData } from "remix";

type LoaderData = { widgetId: string };

export const loader: LoaderFunction = async ({ params }) => {
    console.log(params);

    return params;
};

export default function FeedbackRoute() {
    const data = useLoaderData<LoaderData>();

    return <div>{data.widgetId}</div>;
}
