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

export default class Content extends Component {
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

    async componentDidMount() {
        this._web3Instance = await new Web3Instance().init()
        this.checkConnection()
    }

    async checkConnection() {
        if (isConnected()) {
            await this._web3Instance.connect()
            this.load()
        }
    }

    async load() {
        this.setState({
            account: this._web3Instance.getAccount()
        }, () => {
            this.setState({
                displayAccount: this.displayedAccount()
            }, async () => {
                const MDAFactoryContract = await MDATokenFactoryContract(this._web3Instance.getProvider())
                this.MDAFactory = new MDATokenFactory(MDAFactoryContract)

                this.setState({
                    paidTokenAddress: (await this.MDAFactory.getPaidTokenAddress(this.state.account)),
                    paidTokenDecimals: (await this.MDAFactory.getPaidTokenDecimals(this.state.account))
                }, async () => {
                    const Token = await TokenContract(this.state.paidTokenAddress, this._web3Instance.getWeb3(), this.state.account)
                    this.MDATokenFactory = new TokenFactory(Token)

                    this.setState({
                        mdaAllowance: (await this.MDATokenFactory._allowance(
                            this.state.account,
                            this.state.paidTokenAddress,
                            this.state.paidTokenDecimals))
                    })
                })
            })
        })
    }

    displayedAccount() {
        const account = this.state.account
        return `${account.slice(0, 4)}...${account.slice(-4)}`
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

    getTokenCode() {
        if (this.state.tokenType.includes('Basic')) return 0
        if (this.state.tokenType.includes('Standard')) return 1
        if (this.state.tokenType.includes('Burnable')) return 2
        if (this.state.tokenType.includes('Mintable')) return 3
    }

    getItemKeyListByName(list, name) {
        const item = list.find(item => item.name === name)
        return item ? [item.key] : []
    }

    getItemNameByKey(list, key) {
        return list.find(item => item.key === key).name
    }

    async setPrice() {
        if (this.state.tokenType.includes('Basic')
            || this.state.tokenType.includes('Tipo')
            || this.state.payment.includes('Moneda')) {
            this.setState({
                price: '0.00',
                payment: defaultPayment
            })
        } else {
            this.setState({
                price: this.state.payment.includes('MDA')
                    ? (await this.MDAFactory.getDeployPriceMDA(this.state.account))
                    : (await this.MDAFactory.getDeployPriceBNB(this.state.account)),
            })
        }
    }

    getNetworkSymbol(network) {
        return {
            bsc: 'BNB',
            polygon: 'MATIC',
            ethereum: 'ETH'
        }[network]
    }

    getSymbol() {
        const symbol = this.state.payment.split(' ').pop()
        return symbol === 'Pago' ? '' : symbol
    }

    updatePaymentItem() {
        this.setState({
            paymentToken: this.getSymbol(),
            paymentsList: this.state.paymentsList.map(
                payment => payment.key === 'bnb'
                    ? { key: 'bnb', name: `Pagar con ${this.state.networkSymbol}` }
                    : payment
            )
        })
    }

    isFormValidated() {
        return this.state.tokenName !== ''
            && this.state.tokenSymbol !== ''
            && ((this.state.tokenDecimals !== ''
                && !isNaN(this.state.tokenDecimals))
                || this.getTokenCode() === 0)
            && this.state.tokenSupply !== ''
            && !isNaN(this.state.tokenSupply)
            && this.state.tokenType !== defaultTokenType
            && this.state.network !== defaultNetwork
            && (this.state.payment !== defaultPayment
                || (this.state.payment === defaultPayment
                    && this.state.tokenType.includes('Basic')))
    }

    getApproveOrCreateButton() {
        if (this.state.payment.includes('MDA')
            && parseFloat(this.state.mdaAllowance) < parseFloat(this.state.price))
            return <Button disabled={this.state.loading} css={{ marginLeft: '25%' }} bordered size="xl" color="primary" onClick={() => this.approve()}>
                {this.state.loading ? <Loading type="points" color="currentColor" size="xl" /> : <>APPROVE</>}
            </Button>

        return <Button disabled={this.state.loading} css={{ marginLeft: '25%' }} bordered size="xl" color="primary" onClick={() => this.create()}>
            {this.state.loading ? <Loading type="points" color="currentColor" size="xl" /> : <>CREAR TOKEN</>}
        </Button>
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
            {
                isConnected() ?
                    <Row gap={1} css={{ mt: 50 }}>
                        <Col>
                            <Input
                                onChange={e => this.setState({
                                    tokenName: e.target.value
                                })}
                                helperText="Elige un nombre para tu token."
                                width="80%"
                                clearable
                                bordered
                                value={this.state.tokenName}
                                label="Nombre del Token *"
                                placeholder="MetaDapp Token" />
                            <Spacer y={1.5} />
                            <Input
                                onChange={e => this.setState({
                                    tokenSymbol: e.target.value
                                })}
                                helperText="Elige un símbolo para tu token (normalmente de 3 a 5 caracteres)."
                                width="80%"
                                clearable
                                bordered
                                value={this.state.tokenSymbol}
                                label="Símbolo del Token *"
                                placeholder="MDA" />
                            <Spacer y={1.5} />
                            <Input
                                onChange={e => this.setState({
                                    tokenDecimals: e.target.value
                                })}
                                helperText="Inserta el número de decimales de tu token, si no sabes qué poner, inserta 18."
                                width="80%"
                                clearable
                                bordered
                                type="number"
                                disabled={this.getTokenCode() === 0}
                                value={this.state.tokenDecimals}
                                label="Número de decimales del Token *"
                                placeholder="18" />
                            <Spacer y={1.5} />
                            <Input
                                onChange={e => this.setState({
                                    tokenSupply: e.target.value
                                })}
                                helperText="Inserta el suministro inicial de tu token, el cual se enviará a tu cuenta conectada."
                                width="80%"
                                bordered
                                type="number"
                                labelRight={this.state.tokenSymbol}
                                value={this.state.tokenSupply}
                                label="Supply del Token *"
                                placeholder="1,000,000,000" />
                        </Col>
                        <Col css={{ marginTop: '10%' }}>
                            <Row>
                                <Col>
                                    <Dropdown placement='left'>
                                        <Dropdown.Button flat>{this.state.tokenType}</Dropdown.Button>
                                        <Dropdown.Menu
                                            aria-label="Single selection actions"
                                            color="secondary"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={this.getItemKeyListByName(this.state.tokenTypesList, this.state.tokenType)}
                                            onSelectionChange={(e) => this.setState({
                                                tokenType: this.getItemNameByKey(this.state.tokenTypesList, e.currentKey)
                                            }, () => {
                                                this.setPrice()
                                            })}>
                                            {
                                                this.state.tokenTypesList.map((tokenType) => {
                                                    return <Dropdown.Item key={tokenType.key}>{tokenType.name}</Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col>
                                    <Dropdown placement='left'>
                                        <Dropdown.Button flat>{this.state.network}</Dropdown.Button>
                                        <Dropdown.Menu
                                            aria-label="Single selection actions"
                                            color="secondary"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            disabledKeys={this.state.disabledNetworks}
                                            selectedKeys={this.getItemKeyListByName(this.state.networksList, this.state.network)}
                                            onSelectionChange={(e) => this.setState({
                                                payment: defaultPayment,
                                                network: this.getItemNameByKey(this.state.networksList, e.currentKey),
                                                networkSymbol: this.getNetworkSymbol(e.currentKey)
                                            }, () => {
                                                this.updatePaymentItem()
                                            })
                                            }>
                                            {
                                                this.state.networksList.map((network) => {
                                                    return <Dropdown.Item key={network.key}>{network.name}</Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col>
                                    <Dropdown placement='left'>
                                        <Dropdown.Button
                                            disabled={this.state.network === defaultNetwork
                                                || this.state.tokenType.includes('Basic')
                                                || this.state.tokenType.includes('Tipo')}
                                            flat>{this.state.payment}</Dropdown.Button>
                                        <Dropdown.Menu
                                            aria-label="Single selection actions"
                                            color="secondary"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={this.getItemKeyListByName(this.state.paymentsList, this.state.payment)}
                                            onSelectionChange={(e) => this.setState({
                                                payment: this.getItemNameByKey(this.state.paymentsList, e.currentKey)
                                            }, () => {
                                                this.updatePaymentItem()
                                                this.setPrice()
                                            })}>
                                            {
                                                this.state.paymentsList.map((payment) => {
                                                    return <Dropdown.Item key={payment.key}>{payment.name}</Dropdown.Item>
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Spacer y={1.2} />
                            {
                                this.isFormValidated()
                                    ? this.getApproveOrCreateButton()
                                    : <Button disabled css={{ marginLeft: '25%' }} bordered size="xl" color="primary">CREAR TOKEN</Button>
                            }
                        </Col>
                    </Row> :
                    <Login />
            }
        </Container>
    }
}