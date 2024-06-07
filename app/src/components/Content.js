import { Component } from 'react'
import {
    Container,
    Col,
    Row,
    Input,
    Spacer,
    Text,
    Dropdown,
    Button,
    Loading,
    Modal
} from '@nextui-org/react'
import MDATokenFactoryContract from '../contracts/MDATokenFactory'

import MDATokenFactory from '../factory/mdatokenfactory'
import TokenContract from '../contracts/MDAToken'
import TokenFactory from '../factory/tokenfactory'
import { Web3Instance } from '../services/web3Instance'
import { isConnected } from '../util/mda'
import Login from './Login'
import Logout from './icons/Logout'
import OpenLink from './icons/OpenLink'

const defaultTokenType = 'Tipo de Token'
const defaultNetwork = 'Seleccionar Red'
const defaultPayment = 'Moneda de Pago'

class Content extends Component {
    constructor(props) {
        super(props)
        this.InitialState = {
            mdaAllowance: 0,
            paidTokenAddress: undefined,
            paidTokenDecimals: undefined,
            account: undefined,
            displayAccount: undefined,
            deployedAddress: undefined,
            modalVisibility: false,
            modalDeployed: false,
            modalMessage: 'Token creado correctamente!',
            modalTitle: 'Creación de Token',
            tokenName: '',
            tokenSymbol: '',
            tokenDecimals: '',
            tokenSupply: '',
            paymentToken: '',
            price: '0.00',
            tokenType: defaultTokenType,
            networkSymbol: '',
            network: defaultNetwork,
            payment: defaultPayment,
            loading: false,
            disabledNetworks: ['polygon', 'ethereum'],
            networksList: [
                { key: 'bsc', name: 'Binance Smart Chain' },
                { key: 'polygon', name: 'Polygon' },
                { key: 'ethereum', name: 'Ethereum' },
            ],
            paymentsList: [
                { key: 'bnb', name: `Pagar con BNB/MATIC/ETH` },
                { key: 'mda', name: 'Pagar con MDA' }
            ],
            tokenTypesList: [
                { key: 'free', name: 'Basic ERC20 (Gratis)' },
                { key: 'standard', name: 'Standard ERC20' },
                { key: 'burnable', name: 'Burnable ERC20' },
                { key: 'mintable', name: 'Mintable ERC20' }
            ]
        }

        this.state = this.InitialState
    }

    async checkConnection() {
        if (isConnected()) {
            await this._web3Instance.connect()
            this.load()
        }
    }

    resetState() {
        this.setState(this.InitialState)
    }

    disconnect() {
        this._web3Instance.disconnect()
        this.resetState()
    }

    async connect() {
        await this._web3Instance.connect()
        this.checkConnection()
    }

    render() {
        return <Container css={{ mt: 50 }} gap={1}>
            <Row css={{
                'border-bottom': 'solid gray 0.5px !important'
            }}>
                <Col>
                    <h3>
                        Detalles del Token<br />
                        <small className='details_text'>Introduce los detalles del token a crear</small>
                    </h3>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col>
                    <Text blockquote css={{ mb: '20px' }}>
                        <Row>
                            <Col>
                                Precio: {this.state.price} {' '}
                                {this.state.paymentToken}
                            </Col>
                            <Col>
                                <Button bordered size="sm" color="primary" onClick={() => this.state.displayAccount ? this.disconnect() : this.connect()}>
                                    {this.state.displayAccount ? <>{this.state.displayAccount} &nbsp;<Logout size={18} color="#0271f5" /></> : <>Conectarse</>}
                                </Button>
                            </Col>
                        </Row>
                    </Text>
                </Col>
            </Row>
        </Container>
    }
}