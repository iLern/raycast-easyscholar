import { Action, ActionPanel, Form, Icon, LocalStorage, Toast, showToast, Detail } from "@raycast/api";
import React, { useState, useEffect } from 'react';
import axios from "axios";

const url = "https://www.easyscholar.cc/open/getPublicationRank" 

export default function Main() {
  const [secretKey, setSecretKey] = useState<string|undefined>(undefined);

  useEffect(() => {
    // 异步函数需要包在一个异步函数内部
    async function fetchKey() {
      try {
        const key = await LocalStorage.getItem<string>("key");
        setSecretKey(key);
      } catch (error) {
        console.error(error);
      }
    }

    // 调用异步函数
    fetchKey();
  }, []); // 空数组表示只在组件加载时运行一次

  if (secretKey !== undefined) {
    // submitted secret key
    return (
      <Form actions={
        <ActionPanel title="EasyScholar">
          <SubmitPublicationName secretKey={secretKey}/>
        </ActionPanel>
      }>
        <Form.TextArea id="publicationName" title="Publication Name" placeholder="Enter Publication Name..."></Form.TextArea>
      </Form>
    )
  } else {
    return (
        <Form actions={
          <ActionPanel title="EasyScholar">
            <SubmitSecretKey />
          </ActionPanel>
        }>
            <Form.TextArea id="secretKey" title="Secret" placeholder="Enter EasyScholar SecretKey..."></Form.TextArea>
        </Form>
      )
  }
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
      title: "Submiting SecretKey",
    });

    axios.get(url, {
      params: {
        secretKey: values.secretKey
      }
    }).then(async (res) => {
      console.log(res.data);
      if (res.data.code == 40002) { // incorrect key
        toast.style = Toast.Style.Failure;
        toast.message = "Invalid Secret Key";
        toast.title= "login failed"; 
      } else if (res.data.code == 40004) { //correct key but do not have publication name
        toast.style = Toast.Style.Success;
        toast.message = "Secret Key authenticated";
        toast.title = "login";

        // set to Storage
        await LocalStorage.setItem("key", values.secretKey);

        // redirect to submit publication name
        return (
          <Form actions={
            <ActionPanel>
              <SubmitPublicationName secretKey={values.secretKey}/>
            </ActionPanel>
          }>
            <Form.TextArea id="publicationName" title="Publication Name" placeholder="Enter Publication Name..."></Form.TextArea>
          </Form>
        )
      }
    });
  }

  return (
    <Action.SubmitForm icon={Icon.Upload} title="Submit SecretKey" onSubmit={handleSubmit} />
  );
}

function SubmitPublicationName(props: {secretKey: string}) {
  async function handleSubmit(values: {publicationName: string}) {
    if (!values.publicationName) {
      showToast({
        style: Toast.Style.Failure,
        title: "publicationName is required",
      });
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Submiting publicationName",
    });

    axios.get(url, {
      params: {
        secretKey: props.secretKey,
        publicationName: values.publicationName
      }
    }).then(async (res) => {
      console.log(res.data.data.officialRank.all);
      toast.style = Toast.Style.Success;
    });
  }

  return (
      <Action.SubmitForm icon={Icon.Upload} title="Submit Publication Name" onSubmit={handleSubmit} />
  )
}