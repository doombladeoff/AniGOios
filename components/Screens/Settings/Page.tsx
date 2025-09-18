import { Form, Host } from "@expo/ui/swift-ui";
import { PropsWithChildren } from "react";
import { ScrollView, ScrollViewProps, View } from "react-native";

/**
 * Используется для нативной верстки
 * @description для стандартного RN используйте Page
 * @example
 *         <Host style={{ flex: 1 }}>
            <Form>
                {children}
            </Form>
        </Host>
 */
function UIPage({ children, scroll = true }: PropsWithChildren & { scroll?: boolean }) {
    return (
        <Host style={{ flex: 1 }}>
            <Form scrollEnabled={scroll}>
                {children}
            </Form>
        </Host>
    );
}

function UIPage1({ children }: PropsWithChildren) {
    return (
        <Host matchContents style={{ marginTop: 20 }}>
            {children}
        </Host>
    );
}


function Page({ children }: PropsWithChildren) {
    return (
        <View style={{ flex: 1 }}>
            {children}
        </View>
    );
}

type ScrollPageProps = PropsWithChildren<ScrollViewProps>;

const ScrollPage = ({ children, ...scrollViewProps }: ScrollPageProps) => (
    <ScrollView {...scrollViewProps}>
        {children}
    </ScrollView>
);

export { Page, ScrollPage, UIPage, UIPage1 };

