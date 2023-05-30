import { Action, ActionPanel, Form, Icon, Toast, showToast } from "@raycast/api";
import axios from "axios";
import { config } from "process";

export default function Command() {
  return (
    <Form actions={
      <ActionPanel>
        <SubmitSecretKey />
      </ActionPanel>
    }>
        <Form.TextArea id="secretKey" title="Secret" placeholder="Enter EasyScholar SecretKey..."></Form.TextArea>
    </Form>
  )
}

function SubmitSecretKey() {
  async function handleSubmit(values: {secretKey: string}) {
    if (!values.secretKey) {
      showToast({
        style: Toast.Style.Failure,
        title: "Secret is required",
      });

      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Submit SecretKey",
    });

    const url = "https://www.easyscholar.cc/open/getPublicationRank"
    axios.get(url, {
      params: {
        secretKey: values.secretKey
      }
    }).then((res) => {
      console.log(res.data);
      
    });

    toast.style = Toast.Style.Success;
    toast.title = "submitted SecretKey";
    toast.message = "login";
  }

  return (
    <Action.SubmitForm icon={Icon.Upload} title="Submit SecretKey" onSubmit={handleSubmit} />
  );
}
