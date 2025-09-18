import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RenderHtml from 'react-native-render-html';
import { WebView } from 'react-native-webview';

const sanitizeHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/(about:)?\/\/img\.youtube\.com/gi, 'https://img.youtube.com');
};

export default function NewsScreen() {
    // const bottomTabHeight = useBottomTabBarHeight();
    const { id } = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const [data, setData] = useState<any>();

    const fetch = async () => {
        const response = await axios.get(`https://shikimori.one/api/topics/${id}`);
        setData(response.data);
    }

    useEffect(() => {
        fetch();
    }, [id])

    useEffect(() => { console.log(data) }, [data])
    return (
        <>
            <ScrollView contentContainerStyle={{
                paddingTop: 20,
                //  paddingBottom: bottomTabHeight + 20,
                gap: 10, paddingHorizontal: 10
            }}>
                <RenderHtml
                    contentWidth={width}
                    source={{ html: sanitizeHtml(data?.html_body) }}
                    baseStyle={{ color: '#fff' }}
                    tagsStyles={{
                        p: { color: '#fff', fontSize: 14 },
                        li: { color: 'white', justifyContent: 'center', alignItems: 'center' },
                        span: { color: 'skyblue' },
                        a: { color: 'skyblue', fontSize: 14 }
                    }}
                />
                {/* <RenderHtml
                    contentWidth={width / 1.5}
                    enableUserAgentStyles
                    enableExperimentalBRCollapsing
                    enableExperimentalGhostLinesPrevention
                    enableExperimentalMarginCollapsing
                    source={{
                        html: `
                              <div style="display:flex; flex-direction:row; gap:8px; flex-wrap:nowrap;">
                                ${sanitizeHtml(data?.html_footer) ?? ''}
                            </div>
                         `
                    }}
                    baseStyle={{ color: '#fff' }}
                    tagsStyles={{
                        p: { color: '#fff' },
                        li: { color: '#fff' },
                        span: { color: '#fff' }
                    }}
                /> */}
                <WebView
                    source={{
                        html: `
                                                  <div style="display:flex; flex-direction:row; gap:8px; flex-wrap:nowrap;">
                                ${sanitizeHtml(data?.html_footer) ?? ''}
                            </div>
                            `}}
                    style={{ width: width, height: width * 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: 'black' }}
                />
            </ScrollView>

        </>
    )
}