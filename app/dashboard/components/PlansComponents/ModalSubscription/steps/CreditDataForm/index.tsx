import { buy_payment_methods } from "@/app/dashboard/components/interfaces";
import { IPlan } from "@/hooks/use-subscriptions";
import React, { useImperativeHandle, useCallback, useRef, useState, FormEvent, forwardRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { BsCreditCardFill } from 'react-icons/bs';
import { MdPix } from "react-icons/md";
import { RiBarcodeFill } from "react-icons/ri";
import { FinishSubscription } from "../FinishSubscription";
import { PlanIcons } from "../../../PlanCard";
import { maskFunctions } from "@/lib/maskServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import CreditCard from "react-credit-cards";
import valid from "card-validator";
import { GerencianetCartao } from "../../../../../../../lib/gerencianetCartao";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { validateCardNumber, validateCEP, validateCNPJ, validateCPF, validateDate, validateDueDate, validateEmail, validatePhone } from "@/lib/validatesFields";
import { useAuth } from "@/hooks/use-auth";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Cards from "react-credit-cards-2";
import { User } from "@/lib/types";

// Função para remover máscaras (pontuação) de strings
const removeMask = (value: string | undefined): string => {
    if (!value) return "";
    return value.replace(/\D/g, "");
};

interface ICreditDataForm {
    default_plan?: IPlan
    onChangePlan?: Function
    amount: number
    onSucess: () => void
}

export interface CreditDataRefProps {
    forceSubmit: () => any
}

// Serviço para consultas de estados e cidades
const consultsServices = {
    state_id: async (search?: string) => {
        try {
            const response = await api.get('/states', {
                params: { search }
            });
            return response.data.map((state: any) => ({
                label: state.name,
                value: state.id,
                initials: state.initials,
                this: state
            }));
        } catch (error) {
            console.error('Erro ao buscar estados:', error);
            return [];
        }
    },
    city_id: async (search?: string, state_id?: string) => {
        try {
            const response = await api.get('/cities', {
                params: { search, state_id }
            });
            return response.data.map((city: any) => ({
                label: city.name,
                value: city.id,
                this: city
            }));
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
            return [];
        }
    }
};

const methodsAllowed: buy_payment_methods[] = ["credit_card", "banking_billet"]

const correct_methods: any = {
    "credit_card": {
        label: "Cartão de crédito",
        icon: <BsCreditCardFill color="#FFF" size={26} />
    },
    "pix": {
        label: "Pix",
        icon: <MdPix style={{ color: "#FFF" }} />
    },
    "banking_billet": {
        label: "Boleto bancário",
        icon: <RiBarcodeFill color="#FFF" size={26} />
    }
}

const formatDate = (date: any) => {
    const d = new Date(date)
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return [year, month, day].join("-")
}

const getBrand = (cardNumber: any) => {
    // const brand_types = ["visa", "mastercard", "amex", "elo", "hipercard"]
    let value = cardNumber.replace(/\D+/g, "")?.split("") || [""]

    while (value.length > 16) value.splice(16, 1)

    const correct_value = value.join("")
    const card = valid.number(correct_value)

    const correct_card_type = card?.card?.type === "american-express" ? "amex" : card?.card?.type

    return correct_card_type
}


export const personsTypesOptions = [
    { value: "PF", label: "Pessoa Física" },
    { value: "PJ", label: "Pessoa Jurídica" },
];

const CreditDataFormComponent: React.ForwardRefRenderFunction<CreditDataRefProps, ICreditDataForm> = (props, ref) => {
    const { default_plan, onChangePlan = () => { }, amount, onSucess } = props

    const { register, handleSubmit, control, watch, formState: { errors }, setError, setValue, trigger, unregister } = useForm({
        mode: "all"
    });

    const { user, setUser } = useAuth()

    const _form = watch()

    const [loadingCEP, setLoadingCEP] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [payment_method, setPaymentMethod] = useState<buy_payment_methods>("credit_card")
    const [focus, setFocus] = useState<"name" | "cvc" | "expiry" | "number" | undefined>(undefined)

    const buttonSubmitRef = useRef<HTMLButtonElement>(null)

    const forceSubmit = useCallback(() => buttonSubmitRef.current?.click(), [buttonSubmitRef])

    const changeCEP = useCallback(async (search: any) => {
        search = search.replace(/\D/g, "")
        /* if (search.length === 8) {
            setLoadingCEP(true)
            try {
                // Aqui você pode implementar a busca de CEP via API
                // Por enquanto, vamos apenas limpar os campos de endereço
                setValue("public_place", "")
                setValue("district", "")
                setValue("complement", "")
                setValue("city_id", null, { shouldValidate: true })
                setValue("state_id", null)
                trigger()
            } catch (error) {
                console.error('Erro ao buscar CEP:', error)
            } finally {
                setLoadingCEP(false)
            }
        } */
    }, [setValue, trigger])

    // Carregar estados
    const [statesOptions, setStatesOptions] = useState<any[]>([])
    const [citiesOptions, setCitiesOptions] = useState<any[]>([])

    useEffect(() => {
        const loadStates = async () => {
            try {
                const states = await consultsServices.state_id()
                setStatesOptions(states)
            } catch (error) {
                console.error('Erro ao carregar estados:', error)
            }
        }
        loadStates()
    }, [])

    useEffect(() => {
        const loadCities = async () => {
            /*   if (_form.state_id?.value) { */
            try {
                const cities = await consultsServices.city_id(undefined, _form.state_id.value)
                setCitiesOptions(cities)
            } catch (error) {
                console.error('Erro ao carregar cidades:', error)
            }
            /* } else {
                setCitiesOptions([])
            } */
        }
        loadCities()
    }, [_form.state_id])

    const onSubmit = useCallback(async () => setOpenModalConfirm(true), [])

    const handleStopPropagation = useCallback((e: FormEvent<HTMLFormElement>) => {
        e?.stopPropagation()
        handleSubmit(onSubmit)(e)
    }, [handleSubmit, onSubmit])

    const onPaymentConfirm = useCallback(async () => {
        setLoadingSave(true)
        try {
            const city_name = _form?.city_id?.this?.name
            const state_initials = _form?.state_id?.this?.initials


            const credit_card = {
                cardNumber: _form?.cardNumber,
                dueDate: _form?.dueDate,
                cvv: _form?.cvv
            }

            const address = {
                cep: _form?.cep,
                public_place: _form?.public_place,
                number: _form?.number,
                district: _form?.district,
                complement: _form?.complement,
                city_id: _form?.city_id,
                state_id: _form?.state_id
            }
            let customer = {
                type: _form?.type,
                name: _form?.name,
                corporate_name: _form?.corporate_name,
                email: _form?.email,
                cnpj: removeMask(_form?.cnpj),
                cpf: removeMask(_form?.cpf),
                phone_number: removeMask(_form?.phone_number),
                birth: _form?.birth
            }

            if (amount > 0) {
                if (customer) {
                    customer.birth = customer?.birth ? formatDate(customer?.birth) : undefined
                    /*  customer.juridical_person = {
                         corporate_name: customer?.corporate_name,
                         cnpj: customer?.cnpj
                     } */

                    delete (customer as any)?.type
                    delete (customer as any)?.corporate_name
                    delete (customer as any)?.cnpj
                }

                let creditCardData = null;
                if (payment_method === "credit_card") {
                    /* delete customer?.juridical_person */

                    creditCardData = {
                        brand: getBrand(credit_card?.cardNumber),
                        number: removeMask(credit_card?.cardNumber),
                        expiration_month: credit_card?.dueDate?.slice(0, 2),
                        expiration_year: credit_card?.dueDate?.slice(3, 7),
                        cvv: credit_card?.cvv
                    }
                }
                const data = {
                    credit_card: {},
                    plan_id: default_plan?.id,
                    type: payment_method,
                    banking_billet: {
                        customer,
                        expire_at: formatDate(new Date())
                    },
                    provider_id: user?.provider?.id
                }

                if (payment_method === "credit_card" && amount > 0 && creditCardData) {
                    const sdkGn = await GerencianetCartao.instance(process.env.NEXT_PUBLIC_GERENCIANET_ACCOUNT_ID, false);

                    const { card_mask, payment_token } = await sdkGn.getPaymentToken({ ...creditCardData });

                    const billing_address = {
                        street: address.public_place,
                        number: address.number,
                        neighborhood: address.district,
                        zipcode: address.cep?.replace(/\D/g, ""),
                        city: city_name,
                        state: state_initials
                    }

                    data.credit_card = {
                        card_mask,
                        card_flag: creditCardData.brand,
                        payment_token,
                        customer,
                        billing_address
                    }
                }

                const result = await api.post(`/subscriptions`, data);

                setUser({
                    ...user,
                    subscription_id: result?.data?.id,
                    subscription: result?.data
                } as User)

                onSucess()
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Problema ao assinar plano! Tente novamente mais tarde!",
                variant: "destructive"
            })
        } finally {
            setOpenModalConfirm(false)
            setLoadingSave(false)
        }
    }, [_form, payment_method, api])


    useImperativeHandle(ref, () => ({ forceSubmit }))

    return (
        <div className="w-full">
            <form onSubmit={handleStopPropagation} className="space-y-6">
                {/* Plano Selecionado */}
                {default_plan?.id && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center items-none justify-between gap-3 ">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-primary rounded-full">
                                        <PlanIcons type={default_plan.icon || ''} size={24} opacity={1} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {default_plan.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Valor mensal de {maskFunctions.currency.mask(default_plan.value)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => onChangePlan()}
                                    variant="outline"
                                    size="sm"
                                >
                                    Alterar Plano
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Métodos de Pagamento */}
                {(Number.parseFloat(`${amount}`)) > 0 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Método de Pagamento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {methodsAllowed.map((method) => (
                                        <div
                                            key={method}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${payment_method === method
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                }`}
                                            onClick={() => setPaymentMethod(method)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-full ${payment_method === method ? 'bg-primary' : 'bg-muted' }`}>
                                                    {correct_methods[method].icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {correct_methods[method].label}
                                                    </p>
                                                </div>
                                                {payment_method === method && (
                                                    <Badge variant="default" className="ml-auto">
                                                        Selecionado
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dados do Cartão */}
                        {payment_method === "credit_card" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Dados do Cartão</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {/* Formulário de dados do cartão */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber" className="text-sm font-medium">
                                                    Número do cartão <span className="text-red-500">*</span>
                                                </Label>
                                                <Controller
                                                    name="cardNumber"
                                                    control={control}
                                                    rules={{
                                                        required: "Número do cartão é obrigatório",
                                                        validate: validateCardNumber
                                                    }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            id="cardNumber"
                                                            placeholder="0000 0000 0000 0000"
                                                            onChange={(e) => {
                                                                const value = maskFunctions.creditCard.mask(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                            onFocus={() => setFocus("number")}
                                                            className={`h-12 text-lg ${errors.cardNumber ? 'border-red-500' : ''}`}
                                                        />
                                                    )}
                                                />
                                                {errors.cardNumber && (
                                                    <p className="text-sm text-red-500">{errors.cardNumber.message as string}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="dueDate" className="text-sm font-medium">
                                                        Vencimento <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Controller
                                                        name="dueDate"
                                                        control={control}
                                                        rules={{
                                                            required: "Data de vencimento é obrigatória",
                                                            validate: validateDueDate
                                                        }}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                id="dueDate"
                                                                placeholder="MM/AAAA"
                                                                maxLength={7}
                                                                onChange={(e) => {
                                                                    let value = e.target.value.replace(/\D/g, '');
                                                                    if (value.length > 2) {
                                                                        value = value.substring(0, 2) + '/' + value.substring(2, 6);
                                                                    }
                                                                    field.onChange(value);
                                                                }}
                                                                onFocus={() => setFocus("expiry")}
                                                                className={`h-12 text-lg ${errors.dueDate ? 'border-red-500' : ''}`}
                                                            />
                                                        )}
                                                    />
                                                    {errors.dueDate && (
                                                        <p className="text-sm text-red-500">{errors.dueDate.message as string}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="cvv" className="text-sm font-medium">
                                                        CVV <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Controller
                                                        name="cvv"
                                                        control={control}
                                                        rules={{
                                                            required: "CVV é obrigatório",
                                                            validate: (value) => {
                                                                if ([3, 4].includes(value?.length)) return true;
                                                                return "CVV deve ter 3 ou 4 dígitos";
                                                            }
                                                        }}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                id="cvv"
                                                                placeholder="123"
                                                                onChange={(e) => {
                                                                    const value = maskFunctions.onlyNumber.mask(e.target.value);
                                                                    field.onChange(value);
                                                                }}
                                                                onFocus={() => setFocus("cvc")}
                                                                className={`h-12 text-lg ${errors.cvv ? 'border-red-500' : ''}`}
                                                            />
                                                        )}
                                                    />
                                                    {errors.cvv && (
                                                        <p className="text-sm text-red-500">{errors.cvv.message as string}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simulador de cartão */}
                                        <Cards
                                            cvc={_form?.cvv ?? ""}
                                            expiry={_form?.dueDate ?? ""}
                                            focused={focus}
                                            name={_form?.name ?? ""}
                                            number={_form?.cardNumber ?? ""}
                                            locale={{ valid: "Validade" }}
                                            placeholders={{ name: "NOME SOBRENOME" }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Dados Pessoais */}
                        {["credit_card", "banking_billet"].includes(payment_method) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Dados Pessoais</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nome completo <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="name"
                                                control={control}
                                                rules={{ required: "Nome é obrigatório" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        placeholder="Digite seu nome completo"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="email"
                                                control={control}
                                                rules={{
                                                    required: "Email é obrigatório",
                                                    validate: validateEmail
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="email"
                                                        type="email"
                                                        placeholder="seu@email.com"
                                                        className={errors.email ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">
                                                Telefone <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="phone_number"
                                                control={control}
                                                rules={{
                                                    required: "Telefone é obrigatório",
                                                    validate: validatePhone
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="phone_number"
                                                        placeholder="(11) 99999-9999"
                                                        onChange={(e) => {
                                                            const value = maskFunctions.phone.mask(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className={errors.phone_number ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.phone_number && (
                                                <p className="text-sm text-red-500">{errors.phone_number.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cpf">
                                                CPF <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="cpf"
                                                control={control}
                                                rules={{
                                                    required: "CPF é obrigatório",
                                                    validate: validateCPF
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="cpf"
                                                        placeholder="000.000.000-00"
                                                        onChange={(e) => {
                                                            const value = maskFunctions.cpf.mask(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className={errors.cpf ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.cpf && (
                                                <p className="text-sm text-red-500">{errors.cpf.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birth">
                                                Data de nascimento <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="birth"
                                                control={control}
                                                rules={{
                                                    required: "Data de nascimento é obrigatória",
                                                    validate: validateDate
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="birth"
                                                        placeholder="DD/MM/AAAA"
                                                        onChange={(e) => {
                                                            const value = maskFunctions.date.mask(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className={errors.birth ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.birth && (
                                                <p className="text-sm text-red-500">{errors.birth.message as string}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Endereço (apenas para cartão de crédito) */}
                        {payment_method === "credit_card" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Dados de Endereço</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cep">
                                                CEP <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="cep"
                                                control={control}
                                                rules={{
                                                    required: "CEP é obrigatório",
                                                    validate: validateCEP
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="cep"
                                                        placeholder="00000-000"
                                                        onChange={(e) => {
                                                            const value = maskFunctions.cep.mask(e.target.value);
                                                            field.onChange(value);
                                                            changeCEP(value);
                                                        }}
                                                        className={errors.cep ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.cep && (
                                                <p className="text-sm text-red-500">{errors.cep.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="state_id">
                                                Estado <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="state_id"
                                                control={control}
                                                rules={{ required: "Estado é obrigatório" }}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.value || ''}
                                                        onValueChange={(value) => {
                                                            const option = statesOptions.find(opt => opt.value === value);
                                                            field.onChange(option);
                                                            setValue("city_id", null, { shouldValidate: true });
                                                        }}
                                                    >
                                                        <SelectTrigger className={errors.state_id ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Selecione o estado" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statesOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.state_id && (
                                                <p className="text-sm text-red-500">{errors.state_id.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="city_id">
                                                Cidade <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="city_id"
                                                control={control}
                                                rules={{ required: "Cidade é obrigatória" }}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.value || ''}
                                                        onValueChange={(value) => {
                                                            const option = citiesOptions.find(opt => opt.value === value);
                                                            field.onChange(option);
                                                        }}
                                                        disabled={!statesOptions.length || !_form?.state_id}
                                                    >
                                                        <SelectTrigger className={errors.city_id ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Selecione a cidade" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {citiesOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.city_id && (
                                                <p className="text-sm text-red-500">{errors.city_id.message as string}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="public_place">
                                                Logradouro <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="public_place"
                                                control={control}
                                                rules={{ required: "Logradouro é obrigatório" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="public_place"
                                                        placeholder="Rua, Avenida, etc."
                                                        className={errors.public_place ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.public_place && (
                                                <p className="text-sm text-red-500">{errors.public_place.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="district">
                                                Bairro <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="district"
                                                control={control}
                                                rules={{ required: "Bairro é obrigatório" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="district"
                                                        placeholder="Nome do bairro"
                                                        className={errors.district ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.district && (
                                                <p className="text-sm text-red-500">{errors.district.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="number">
                                                Número <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="number"
                                                control={control}
                                                rules={{ required: "Número é obrigatório" }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="number"
                                                        placeholder="123"
                                                        onChange={(e) => {
                                                            const value = maskFunctions.onlyNumber.mask(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        className={errors.number ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            {errors.number && (
                                                <p className="text-sm text-red-500">{errors.number.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="complement">Complemento</Label>
                                            <Controller
                                                name="complement"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="complement"
                                                        placeholder="Apartamento, sala, etc."
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                <button
                    ref={buttonSubmitRef}
                    type="submit"
                    style={{ display: "none" }}
                />

                {/*   <ModalLoading
                    theme={theme}
                    loading={loadingSave}
                /> */}
            </form>

            {openModalConfirm && default_plan?.id &&
                <FinishSubscription
                    planSelected={default_plan}
                    openModal={openModalConfirm}
                    onCancel={() => setOpenModalConfirm(false)}
                    onConfirm={onPaymentConfirm}
                    loading={loadingSave}
                />
            }
        </div>
    )
}

export const CreditDataForm = React.forwardRef(CreditDataFormComponent)