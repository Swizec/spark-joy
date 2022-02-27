import { ActionFunction, redirect } from "remix";

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();

    console.log(formData);

    return redirect(`/${params.widgetId}/saveFeedback`);
};

export default function SaveFeedback() {
    return <h1>Thanks! You're the best ❤️</h1>;
}
