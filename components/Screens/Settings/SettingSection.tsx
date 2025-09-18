import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SettingSectionProps {
    label: string;
    children: React.ReactNode;
}

const SettingSection = ({ label, children }: SettingSectionProps) => {
    const items = React.Children.toArray(children);
    return (
        <View style={{ marginHorizontal: 20, gap: 5, marginVertical: 10 }}>
            <Text style={{ color: 'rgba(140, 140, 140, 1)', paddingHorizontal: 20 }}>{label}</Text>
            <View style={{
                padding: 20,
                paddingVertical: 10,
                backgroundColor: '#1c1c1e',
                borderRadius: 12
            }}>
                {items.map((child, index) => (
                    <View key={index}>
                        {child}
                        {index < items.length - 1 && <View style={styles.separator} />}
                    </View>
                ))}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#cccccc35",
        marginVertical: 12,
    },
});

export default SettingSection