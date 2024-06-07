import { Row, Text } from "@nextui-org/react";

export default function Error404() {
    return (
        <Row justify="center" align="center" css={{ p: "$6", mw: "max-width", mt: '25%' }}>
            <Text h6 size={30} css={{ m: 0 }}>
                Página no encontrada
            </Text>
        </Row>
    )
}