import {
    Action,
    ActionPanel,
    Form,
    LocalStorage,
    List,
    useNavigation,
    Detail,
} from '@raycast/api'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { splitDictToList } from './util'

const url = 'https://www.easyscholar.cc/open/getPublicationRank'

interface QueryRequest {
    secretKey: string
    publicationName: string
}

export default function Main() {
    const { push } = useNavigation()
    const [secretKey, setSecretKey] = useState<string | undefined>(undefined)

    useEffect(() => {
        async function fetchKey() {
            try {
                const key = await LocalStorage.getItem<string>('key')
                setSecretKey(key)
            } catch (error) {
                console.error(error)
            }
        }

        fetchKey()
    }, [])

    if (secretKey === undefined) {
        // no secret key
        return (
            <Form
                actions={
                    <ActionPanel title='EasyScholar'>
                        <Action.SubmitForm
                            title='EasyScholar'
                            onSubmit={(input: QueryRequest) => {
                                push(
                                    <SubmitSecretKey
                                        secretKey={input.secretKey}
                                    />,
                                )
                            }}
                        />
                    </ActionPanel>
                }
            >
                <Form.TextArea
                    id='secretKey'
                    title='Secret Key'
                    placeholder='Enter EasyScholar SecretKey...'
                    autoFocus={true}
                ></Form.TextArea>
            </Form>
        )
    } else {
        return (
            <Form
                actions={
                    <ActionPanel title='EasyScholar'>
                        <Action.SubmitForm
                            title='EasyScholar'
                            onSubmit={(input: QueryRequest) => {
                                push(
                                    <QueryRank
                                        secretKey={secretKey}
                                        publicationName={input.publicationName}
                                    />,
                                )
                            }}
                        />
                    </ActionPanel>
                }
            >
                <Form.TextField
                    id='publicationName'
                    title='Publication Name'
                    placeholder='Enter PublicationName...'
                    autoFocus={true}
                ></Form.TextField>
            </Form>
        )
    }
}

function SubmitSecretKey(props: { secretKey: string }) {
    const { push } = useNavigation()

    useEffect(() => {
        async function identifyKey() {
            axios
                .get(url, {
                    params: {
                        secretKey: props.secretKey,
                    },
                })
                .then(async res => {
                    console.log(res.data)
                    if (res.data.code == 40004) {
                        // correct key
                        // set to Storage
                        await LocalStorage.setItem('key', props.secretKey)
                    }
                })
        }

        identifyKey()
    }, [])

    return (
        <Form
            actions={
                <ActionPanel title='EasyScholar'>
                    <Action.SubmitForm
                        title='EasyScholar'
                        onSubmit={(input: QueryRequest) => {
                            push(
                                <QueryRank
                                    secretKey={props.secretKey}
                                    publicationName={input.publicationName}
                                />,
                            )
                        }}
                    />
                </ActionPanel>
            }
        >
            <Form.TextField
                id='publicationName'
                title='Publication Name'
                placeholder='Enter PublicationName...'
                autoFocus={true}
            ></Form.TextField>
        </Form>
    )
}

function QueryRank(props: { secretKey: string; publicationName: string }) {
    const [queryResult, setQueryResult] = useState<Map<string, string>>(
        new Map<string, string>(),
    )
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function queryRank() {
            try {
                const res = await axios.get(url, {
                    params: {
                        secretKey: props.secretKey,
                        publicationName: props.publicationName,
                    },
                })

                if (res.data.code === 200) {
                    const queryResultData = res.data.data.officialRank.all
                    setQueryResult(queryResultData)
                }

                setIsLoading(false) // 设置异步操作完成标志
            } catch (error) {
                console.error(error)
                setIsLoading(false) // 设置异步操作完成标志（出错时也要设置）
            }
        }

        queryRank()
    }, [props.secretKey, props.publicationName]) // 添加props依赖，确保在props改变时重新执行异步操作

    // 等待异步操作完成后再渲染结果
    if (isLoading) {
        return <Detail markdown={'# Loading...'}></Detail>
    }

    console.log(queryResult)
    const rank = splitDictToList(queryResult)
    console.log(rank)

    return (
        <List navigationTitle={props.publicationName}>
            {rank.map((item, index) => (
                <List.Item
                    key={index}
                    title={item.publicationName}
                    subtitle={item.rank}
                ></List.Item>
            ))}
        </List>
    )
}
