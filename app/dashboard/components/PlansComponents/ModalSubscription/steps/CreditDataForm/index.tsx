import { buy_payment_methods, IGroupProps, IOptionsProps, IFieldProps } from "@/app/dashboard/components/interfaces";
import { IPlan } from "@/hooks/use-subscriptions";
import React, { useImperativeHandle, useCallback, useRef, useState, FormEvent, forwardRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { BsCreditCardFill, BsFillHouseFill } from 'react-icons/bs';
import { MdPix } from "react-icons/md";
import { RiBarcodeFill } from "react-icons/ri";
import { FinishSubscription } from "../FinishSubscription";
import { PlanIcons } from "../../../PlanCard";
import { maskFunctions } from "@/lib/maskServices";
import { Button } from "@/components/ui/button";
import { MagicButton } from "@/components/MagicButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Card from "react-credit-cards";
import valid from "card-validator";
import { GerencianetCartao } from "../../../../../../../lib/gerencianetCartao";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { validateCardNumber, validateCEP, validateCNPJ, validateCPF, validateDate, validateDueDate, validateEmail, validatePhone } from "@/lib/validatesFields";
import { useAuth } from "@/hooks/use-auth";

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

export interface IGenericFormRefProps {
    getForm: () => any
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


export const personsTypesOptions: IOptionsProps[] = [
    { value: "PF", label: "Pessoa Física" },
    { value: "PJ", label: "Pessoa Jurídica" },
];

// Componente GenericForm
interface GenericFormProps {
    groups: IGroupProps[]
    _form: any
    control: any
    errors: any
    trigger: any
    setValue: any
    register: any
    disabled?: boolean
    containerStyle?: any
}

const GenericFormComponent = forwardRef<IGenericFormRefProps, GenericFormProps>(({
    groups,
    _form,
    control,
    errors,
    trigger,
    setValue,
    register,
    disabled = false,
    containerStyle
}, ref) => {
    const getForm = useCallback(() => _form, [_form]);

    useImperativeHandle(ref, () => ({ getForm }));

    const renderField = (field: IFieldProps) => {
        const fieldError = errors[field.name];
        const fieldValue = _form[field.name];

        if (field.canSee && !field.canSee(_form)) {
            return null;
        }

        const isDisabled = disabled || (field.getIsDisabled && field.getIsDisabled(_form));

        switch (field.type) {
            case 'input':
                return (
                    <div key={field.name} className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Controller
                            name={field.name}
                            control={control}
                            rules={{
                                required: field.required,
                                validate: field.validate
                            }}
                            render={({ field: controllerField }) => (
                                <Input
                                    {...controllerField}
                                    id={field.name}
                                    disabled={isDisabled}
                                    placeholder={field.label}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (field.mask && maskFunctions[field.mask]) {
                                            value = maskFunctions[field.mask].mask(value);
                                        }
                                        controllerField.onChange(value);
                                        if (field.executeOnChange) {
                                            field.executeOnChange(value);
                                        }
                                    }}
                                />
                            )}
                        />
                        {fieldError && (
                            <span className="text-red-500 text-sm">{fieldError.message}</span>
                        )}
                    </div>
                );

            case 'select-fixed':
                return (
                    <div key={field.name} className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Controller
                            name={field.name}
                            control={control}
                            rules={{
                                required: field.required,
                                validate: field.validate
                            }}
                            render={({ field: controllerField }) => (
                                <Select
                                    value={controllerField.value?.value || ''}
                                    onValueChange={(value) => {
                                        const option = field.options?.find((opt: any) => opt.value === value);
                                        controllerField.onChange(option);
                                    }}
                                    disabled={isDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option: IOptionsProps) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {fieldError && (
                            <span className="text-red-500 text-sm">{fieldError.message}</span>
                        )}
                    </div>
                );

            case 'select-single-no-creatable':
                return (
                    <div key={field.name} className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Controller
                            name={field.name}
                            control={control}
                            rules={{
                                required: field.required,
                                validate: field.validate
                            }}
                            render={({ field: controllerField }) => (
                                <Select
                                    value={controllerField.value?.value || ''}
                                    onValueChange={(value) => {
                                        const option = field.options?.find((opt: any) => opt.value === value);
                                        controllerField.onChange(option);
                                        if (field.executeOnChange) {
                                            field.executeOnChange(option);
                                        }
                                    }}
                                    disabled={isDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option: IOptionsProps) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {fieldError && (
                            <span className="text-red-500 text-sm">{fieldError.message}</span>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={containerStyle} className="space-y-4">
            {groups.map((group) => {
                if (group.canSee && !group.canSee(_form)) {
                    return null;
                }

                return (
                    <div key={group.name} className="space-y-4">
                        <h3 className="text-lg font-semibold">{group.label}</h3>
                        {group.fields.map((fieldRow, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fieldRow.map((field) => renderField(field))}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
});

const GenericForm = GenericFormComponent;

const CreditDataFormComponent: React.ForwardRefRenderFunction<CreditDataRefProps, ICreditDataForm> = (props, ref) => {
    const { default_plan, onChangePlan = () => { }, amount, onSucess } = props

    const { register, handleSubmit, control, watch, formState: { errors }, setError, setValue, trigger, unregister } = useForm({
        mode: "all"
    });

    const { user } = useAuth()

    const _form = watch()

    const [loadingCEP, setLoadingCEP] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [payment_method, setPaymentMethod] = useState<buy_payment_methods>("credit_card")
    const [focus, setFocus] = useState<"name" | "cvc" | "expiry" | "number" | undefined>(undefined)

    const buttonSubmitRef = useRef<HTMLButtonElement>(null)
    const creditCardFormRef = useRef<IGenericFormRefProps>(null)
    const complementFormRef = useRef<IGenericFormRefProps>(null)

    const forceSubmit = useCallback(() => buttonSubmitRef.current?.click(), [buttonSubmitRef])

    const changeCEP = useCallback(async (search: any) => {
        search = search.replace(/\D/g, "")
        if (search.length === 8) {
            setLoadingCEP(true)
            try {
                // Aqui você pode implementar a busca de CEP via API
                // Por enquanto, vamos apenas limpar os campos de endereço
                setValue("public_place", "")
                setValue("district", "")
                setValue("complement", "")
                setValue("city_id", null)
                setValue("state_id", null)
                trigger()
            } catch (error) {
                console.error('Erro ao buscar CEP:', error)
            } finally {
                setLoadingCEP(false)
            }
        }
    }, [setValue, trigger])

    // Carregar estados
    const [statesOptions, setStatesOptions] = useState<IOptionsProps[]>([])
    const [citiesOptions, setCitiesOptions] = useState<IOptionsProps[]>([])

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

    // Carregar cidades quando estado for selecionado
    useEffect(() => {
        const loadCities = async () => {
            if (_form.state_id?.value) {
                try {
                    const cities = await consultsServices.city_id(undefined, _form.state_id.value)
                    setCitiesOptions(cities)
                } catch (error) {
                    console.error('Erro ao carregar cidades:', error)
                }
            } else {
                setCitiesOptions([])
            }
        }
        loadCities()
    }, [_form.state_id])

    const onSubmit = useCallback(async () => setOpenModalConfirm(true), [_form, creditCardFormRef, complementFormRef, payment_method, api])

    const handleStopPropagation = useCallback((e: FormEvent<HTMLFormElement>) => {
        e?.stopPropagation()
        handleSubmit(onSubmit)(e)
    }, [handleSubmit, onSubmit, _form, creditCardFormRef, complementFormRef, payment_method])

    const onPaymentConfirm = useCallback(async () => {
     /*    setOpenModalConfirm(false) */

        setLoadingSave(true)
        try {
            const creditDataForm = creditCardFormRef.current?.getForm();
            const complementCreditDataForm = complementFormRef.current?.getForm();

            const city_name = _form?.city_id?.this?.name
            const state_initials = _form?.state_id?.this?.initials
            
            const credit_card = creditDataForm?.credit_card
            const address = {
                cep: complementCreditDataForm?.cep,
                public_place: complementCreditDataForm?.public_place,
                number: complementCreditDataForm?.number,
                district: complementCreditDataForm?.district,
                complement: complementCreditDataForm?.complement,
                city_id: complementCreditDataForm?.city_id,
                state_id: complementCreditDataForm?.state_id
            } 
            let customer = {
                type: complementCreditDataForm?.type,
                name: complementCreditDataForm?.name,
                corporate_name: complementCreditDataForm?.corporate_name,
                email: complementCreditDataForm?.email,
                cnpj: removeMask(complementCreditDataForm?.cnpj),
                cpf: removeMask(complementCreditDataForm?.cpf),
                phone_number: removeMask(complementCreditDataForm?.phone_number),
                birth: complementCreditDataForm?.birth
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

                if (payment_method === "credit_card") {
                    /* delete customer?.juridical_person */

                    credit_card.brand = getBrand(credit_card?.cardNumber)
                    credit_card.number = credit_card?.cardNumber
                    credit_card.expiration_month = credit_card?.dueDate?.slice(0, 2)
                    credit_card.expiration_year = credit_card?.dueDate?.slice(3, 7)
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

            if (payment_method === "credit_card" && amount > 0) {
                const sdkGn = await GerencianetCartao.instance(process.env.NEXT_PUBLIC_GERENCIANET_ACCOUNT_ID, true);
                const { card_mask, payment_token } = await sdkGn.getPaymentToken({ ...credit_card });

                const billing_address = {
                    street: address.public_place,
                    number: address.number,
                    neighborhood: address.district,
                    zipcode: address.cep,
                    city: city_name,
                    state: state_initials
                }

                data.credit_card = {
                    card_mask,
                    card_flag: credit_card.brand,
                    payment_token,
                    customer,
                    billing_address
                }
            }

            console.log(data)
           const result = await api.post(`/subscriptions`, data);

           /*   onSucess() */
        } catch (err) {
            console.error(err);
            toast({
                title: "Problema ao assinar plano! Tente novamente mais tarde!",
                variant: "destructive"
            })
        }

        setLoadingSave(false)
    }, [_form, creditCardFormRef, complementFormRef, payment_method, api])

    const creditCardGroups: IGroupProps[] = [
        {
            label: "Dados do cartão",
            name: "credit_card",
            fields: [
                [
                    {
                        label: "Número do cartão",
                        name: "cardNumber",
                        type: "input",
                        mask: "creditCard",
                        validate: validateCardNumber,
                        required: true
                    }
                ],
                [
                    {
                        label: "Vencimento",
                        name: "dueDate",
                        type: "input",
                        mask: "dueDate",
                        validate: validateDueDate,
                        required: true
                    }
                ],
                [
                    {
                        label: "Código de segurança",
                        name: "cvv",
                        type: "input",
                        mask: "onlyNumber",
                        required: true,
                        validate: async (value: any) => {
                            if ([3, 4].includes(value?.length)) return true
                            else return "Formato inválido"
                        }
                    }
                ]
            ]
        }
    ]

    const complementGroups: IGroupProps[] = [
        {
            label: "Seus dados",
            name: "customer",
            canSee: () => ["credit_card", "banking_billet"].includes(payment_method),
            fields: [
                [
                    {
                        name: "type",
                        label: "Tipo",
                        type: "select-fixed",
                        required: true,
                        options: personsTypesOptions,
                        canSee: () => payment_method === "banking_billet"
                    }
                ],
                [
                    {
                        label: "Nome completo",
                        name: "name",
                        type: "input",
                        required: true,
                        canSee: (data: any) => ["credit_card"].includes(payment_method) || (["banking_billet"].includes(payment_method) && data?.type?.value === "PF")
                    },
                    {
                        name: "corporate_name",
                        label: "Razão Social",
                        type: "input",
                        required: true,
                        canSee: (data: any) => ["banking_billet"].includes(payment_method) && data?.type?.value === "PJ"
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "input",
                        validate: validateEmail,
                        required: true,
                        canSee: () => ["banking_billet", "credit_card"].includes(payment_method)
                    }
                ],
                [
                    {
                        name: "cnpj",
                        label: "CNPJ",
                        type: "input",
                        mask: "cnpj",
                        validate: validateCNPJ,
                        required: true,
                        canSee: (data: any) => ["banking_billet"].includes(payment_method) && data?.type?.value === "PJ"
                    },
                    {
                        label: "CPF",
                        name: "cpf",
                        type: "input",
                        mask: "cpf",
                        validate: validateCPF,
                        required: true,
                        canSee: (data: any) => ["credit_card"].includes(payment_method) || (["banking_billet"].includes(payment_method) && data?.type?.value === "PF")
                    },
                    {
                        name: "phone_number",
                        label: "Telefone",
                        type: "input",
                        mask: "phone",
                        validate: validatePhone,
                        required: true,
                        canSee: () => ["banking_billet", "credit_card"].includes(payment_method)
                    },
                    {
                        label: "Data de nascimento",
                        name: "birth",
                        type: "input",
                        mask: "date",
                        validate: validateDate,
                        required: true,
                        canSee: (data: any) => ["credit_card"].includes(payment_method) || (["banking_billet"].includes(payment_method) && data?.type?.value === "PF")
                    }
                ]
            ]
        },
        {
            name: "address",
            label: "Dados de Endereço",
            canSee: () => ["credit_card"].includes(payment_method),
            fields: [
                [
                    {
                        name: "cep",
                        label: "CEP",
                        type: "input",
                        mask: "cep",
                        validate: validateCEP,
                        executeOnChange: changeCEP,
                        required: true,
                        canSee: () => payment_method === "credit_card"
                    },
                    {
                        name: "state_id",
                        label: "Estado",
                        type: "select-single-no-creatable",
                        isClearable: true,
                        options: statesOptions,
                        executeOnChange: async () => setValue("city_id", null),
                        required: true,
                        canSee: () => payment_method === "credit_card"
                    },
                    {
                        name: "city_id",
                        label: "Cidade",
                        type: "select-single-no-creatable",
                        isClearable: true,
                        options: citiesOptions,
                        getIsDisabled: (data: any) => !data?.state_id,
                        required: true,
                        canSee: () => payment_method === "credit_card"
                    }
                ],
                [
                    {
                        name: "district",
                        label: "Bairro",
                        type: "input",
                        canSee: () => payment_method === "credit_card",
                        required: true
                    },
                    {
                        name: "public_place",
                        label: "Logradouro",
                        type: "input",
                        canSee: () => payment_method === "credit_card",
                        required: true
                    },
                    {
                        name: "complement",
                        label: "Complemento",
                        type: "input",
                        canSee: () => payment_method === "credit_card"
                    },
                    {
                        name: "number",
                        label: "Número",
                        type: "input",
                        mask: "onlyNumber",
                        canSee: () => payment_method === "credit_card",
                        required: true
                    }
                ]
            ]
        }
    ]

    useImperativeHandle(ref, () => ({ forceSubmit }))

    return (
        <>
            <form onSubmit={handleStopPropagation}>
                {default_plan?.id &&
                    <div className="flex gap-2.5 flex-wrap justify-between rounded-md p-2.5 bg-primary border-2 border-border">
                        <div className="flex" style={{ gap: 10, alignItems: "center" }}>
                            <div className="p-2.5 justify-center bg-secondary items-center rounded-[50%] min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]">
                                <PlanIcons type={default_plan.icon || ''} size={26} opacity={1} />
                            </div>
                            <div className="flex flex-col" style={{ justifyContent: "center" }}>
                                <b>
                                    {default_plan.name}
                                </b>
                                <div style={{ fontSize: 14 }}>
                                    Valor mensal de {maskFunctions.currency.mask(default_plan.value)} por acomodação ativa
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col" style={{ justifyContent: "center" }}>
                            <Button
                                onClick={() => { onChangePlan() }}
                                children="Alterar"
                                variant='outline'
                            />
                        </div>
                    </div>
                }

                {(Number.parseFloat(`${amount}`)) > 0 && (
                    <>
                        <div className="flex flex-col">
                            <div className="flex flex-col" style={{ gap: 10 }}>
                                <b>Método de pagamento</b>

                                <div className="flex flex-1 gap-5 flex-wrap">
                                    {methodsAllowed.map((method) => (
                                        <div className="gap-2.5 cursor-pointer min-w-[250px] flex-1 justify-between rounded-md p-2.5 bg-primary border-2 border-border" key={method + "-button"} onClick={() => setPaymentMethod(method)}>
                                            <MagicButton
                                                disabled={false}
                                                type="radio"
                                                checked={payment_method === method}
                                                onClick={() => setPaymentMethod(method)}
                                                {...correct_methods[method]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {payment_method === "credit_card" && (
                                <div className="flex gap-5 items-end flex-wrap">
                                    <GenericForm
                                        ref={creditCardFormRef}
                                        groups={creditCardGroups}
                                        _form={_form}
                                        control={control}
                                        errors={errors}
                                        trigger={trigger}
                                        setValue={setValue}
                                        register={register}
                                        disabled={loadingCEP}
                                        containerStyle={{ flex: 1 }}
                                    />
                                    <div className="flex items-end pt-2.5">
                                        <Card
                                            cvc={_form?.cvv ?? ""}
                                            expiry={_form?.dueDate ?? ""}
                                            focused={focus}
                                            name={_form?.name ?? ""}
                                            number={_form?.cardNumber ?? ""}
                                            locale={{ valid: "Validade" }}
                                            placeholders={{ name: "NOME SOBRENOME" }}
                                        />
                                    </div>
                                </div>
                            )}

                            <GenericForm
                                ref={complementFormRef}
                                groups={complementGroups}
                                _form={_form}
                                control={control}
                                errors={errors}
                                trigger={trigger}
                                setValue={setValue}
                                register={register}
                                disabled={loadingCEP}
                            />
                        </div>
                    </>
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
                />
            }
        </>
    )
}

export const CreditDataForm = React.forwardRef(CreditDataFormComponent)