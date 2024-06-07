import { Row, Text } from "@nextui-org/react";

export default function Login() {
    return (
        <Row justify="center" align="center" css={{ p: "$6", mw: "max-width", mt: '20%' }}>
            <Text h6 size={25} css={{ m: 0 }}>
                Debes conectarte a Metamask o Walletconnect para continuar.
            </Text>
        </Row>
    )
}