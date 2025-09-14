import { ComponentType } from "react";

export type MaskTypes =
  | "int"
  | "currencyInt"
  | "creditCard"
  | "dueDate"
  | "cep"
  | "porcen"
  | "currency"
  | "cpf"
  | "cnpj"
  | "cpfOrCnpj"
  | "onlyNumber"
  | "phone"
  | "date"
  | "m2"
  | "text"
  | "file"

export type FilterKeysTypes =
  | "person_id"
  | "franchise_id"
  | "person_type"
  | "type"
  | "range_picker"
  | "analyst_id"
  | "friendly_id"
  | "bond_type"
  | "signatory_id"
  | "signatory"
  | "cep"
  | "cpf"
  | "creci"
  | "cnpj"
  | "cpfOrCnpj"
  | "name"
  | "value_min"
  | "value_max"
  | "public_place"
  | "number"
  | "district"
  | "city_id"
  | "state_id"
  | "type_consult"
  | "property_type_id"
  | "owner_id"
  | "broker_id"
  | "tenant_id"
  | "id"
  | "status"
  | "plan_id"
  | "date_init"
  | "date_end"
  | "date_range";

export type IntegrationsTypes = "wpp" | "stays" | "magikey";

export type brandTypes = "visa" | "mastercard" | "amex" | "elo" | "hipercard";

export type buy_payment_methods = "credit_card" | "pix" | "banking_billet";

export type themeTypes = "light" | "dark";

export type personsTypes =
  | "responsible"
  | "manager"
  | "broker"
  | "analyst"
  | null;

export type fieldTypes =
  | "input"
  | "textarea"
  | "input-porcen-or-money"
  | "input-day-or-month"
  | "file"
  | "file-image"
  | "select-person"
  | "select-property"
  | "select-multi-persons"
  | "switch"
  | "select-fixed"
  | "select-fixed-cards"
  | "select-single-creatable"
  | "select-multi-creatable"
  | "select-fixed-multi"
  | "select-single-no-creatable"
  | "select-single-cards-no-creatable"
  | "color"

export type userTypes =
  | "root"
  | "responsible"
  | "manager"
  | "broker"
  | "analyst";

export interface IFieldProps {
  name: string;
  label: string;
  type: fieldTypes;
  mask?: MaskTypes;
  required?: boolean | string;
  options?: any;
  getOptions?: (form: any) => any;
  searchOptions?: any;
  canSee?: (form: any) => boolean;
  getIsDisabled?: (form: any) => boolean;
  validate?: (value: any) => Promise<boolean | string>;
  isClearable?: boolean;
  additionalsQueries?: (form: any) => any;
  moreQueries?: object;
  onRemove?: () => void;
  executeOnChange?: (value: any) => Promise<void>;
  tooltip?: string;
  noUpperCase?: boolean;
  onClick?: (value: any) => void;
  getRemoveIds?: (value: any) => any[];
  get_enabled_change_form_type?: (type: "edit" | "new") => boolean;
  backgroundVisible?: boolean;
  isPersonInPerson?: boolean;
  personType?: "spouse" | "representative" | "person";
  getFileSizeMax?: (form: any) => number;
  getFileTypes?: (form: any) => string[];
  numberOfRows?: number;
  formatOptionLabel?: (value: any, options: any) => React.ReactNode;
  isPassword?: boolean;
  icon?: any;
  maxChars?: any;
}

export interface IGroupProps {
  name: string;
  label: string;
  description?: string;
  icon?: ComponentType<any>;
  iconSize?: number;
  fields: IFieldProps[][];
  uniqueId?: string;
  customContent?: React.ReactNode;
  customExtraHeader?: React.ReactNode;
  canSee?: (form: any) => boolean;
}

export interface IGroupBlockFormsProps {
  name: string;
  icon: any;
  description: string;
  content: IGroupProps[];
}

export interface ITDProps {
  isLeft?: boolean;
  isRight?: boolean;
  theme: themeTypes;
  noData?: boolean;
  noHaveClick?: boolean;
}

export interface IFranchisesInRankingProps {
  id: string;
  name: string;
  logo: string;
  contracts: number;
  contracts_canceleds: number;
  contracts_signeds: number;
  decrease: number;
  increase: number;
  proposals: number;
  queries: number;
  status: "active" | "block";
  subscription_payment: number;
  is_trusted: boolean;
  [key: string]: any;
}

export interface IIntegrationTokensProps {
  app_token: string;
  access_token: string;
  status: "active" | "block";
}

export interface IIntegrationsProps {
  wpp: {
    instance: string;
    status: 'connecting' | 'open' | 'disconnected';
  };
  stays: {
    integrationId: string;
    apiUrl: string;
    apiUsername: string;
    apiPassword: string;
  };
  magikey: {
    integrationId: string;
    apiKey: string;
    apiUrl: string;
    active: boolean;
  }
}

export interface walletAttributes {
  franchise_id: string;
  balance: number;
  provisioned: number;
  contract_models_count: number;
  users_count: number;
  documents_size_count: number;
}

export interface IFilters {
  name: string;
  type: "input" | "select" | "select_search" | "range_picker";
  key: FilterKeysTypes;
  defaultValue?: any;
  isNotClearable?: boolean;
  noIcon?: boolean;
  mask?: MaskTypes;
  searchOptionsKey?: string;
  onChange?: Function;
  options?: IOptionsProps[];
  loading?: boolean;
  value?: any;
  moreQueries?: object;
  userTypes?: userTypes[];
  [key: string]: any;
}

export interface executorsProps {
  id: string;
  name: string;
  init: any;
  end: any;
  description: string;
  mask?: MaskTypes;
  type: "PF" | "PJ" | "PF_PJ";
  action: "pending" | "reject";
}

export interface credit_policiesAttributes {
  id: string;
  executors: string | executorsProps[];
  description: string;
  name: string;
  type: "PJ" | "PF";
  is_default: boolean;
  active: boolean;
  franchise_id: string;
}

export interface DateResultProps {
  Year: string;
  Month: string;
  Day: string;
}

export interface documents_typeAttributes {
  id: string;
  type: "property" | "PF" | "PJ";
  name: string;
  extensions: string[];
  size: number;
}

export interface AddressResultProps {
  Street: string;
  Number: string;
  Neighborhood: string;
  City: string;
  State: string;
  PostalCode: string;
  DateLastSeen: DateResultProps;
}

export interface EmailResultProps {
  DateLastSeen: DateResultProps;
  Email: string;
}

export interface PhoneNumberResultProps {
  DateLastSeen: DateResultProps;
  PhoneNumber: string;
}

export interface PersonNameResultProps {
  Name: {
    Full: string;
  };
}

export interface PartnershipResultProps {
  EntityType: "F" | "J";
  CNPJ: string;
  CpfCnpj: string;
  Name: string;
  Status: string;
  CompanyName: string;
  CNPJStatus: string;
  PercentParticipation: string;
  ParticipationValue: string;
  RelationshipDescription: string;
  DateStartPartner: DateResultProps;
  FlagMainJob: string;
  DateReference: DateResultProps;
  TrustLevel: string;
}

export interface LawSuitApontamentosResultProps {
  ProcessNumber: string;
  Comarca: string;
  Forum: string;
  Vara: string;
  Name: string;
  DateDistribution: DateResultProps;
  ProcessType: string;
  AmountLawsuit: string;
  ProcessAuthor: string;
  City: string;
  State: string;
  JusticeType: string;
  EntityType: "F" | "J";
  CpfCnpj: string;
  SimilarityIndex: string;
  IdConfidence: string;
  RegisterId: string;
  RegisterType: string;
  OriginSource: string;
  DateProcessed: DateResultProps;
}

export interface CcfApontamentosResultProps {
  EntityType: "F" | "J";
  CpfCnpj: string;
  ReportingCodeBank: string;
  ReportingNameBank: string;
  ReportingBranchPrefix: string;
  ReasonBounce: string;
  CountBounce: string;
  DateLastBounce: DateResultProps;
}

export interface ApontamentosResultProps { }

export interface InquiryDetailResultProps {
  DateInquiry: DateResultProps;
  InquiryCount: number;
  Segment: string;
}

export interface IndicatorsResultProps {
  Risk: {
    type: string;
    text: string;
  };
  VariableName: string;
  Description: string;
  Value: string;
  Error: string;
}
export interface ResultBiroProps {
  CNPJ: string;
  CPStatus: string;
  Segment: string;
  HasOnlyMinimumPII: string;
  HasNegativeData: boolean;
  HasInquiryData: boolean;
  ScorePJ: {
    Score: number;
  };
  Partner: {
    Partnerships: {
      Partnership: PartnershipResultProps[];
    };
  };
  BestInfo: {
    CPF: string;
    CPFStatus: string;
    CompanyName: string;
    TradeName: string;
    CompanyStatus: string;
    LegalType: string;
    CountBranches: string;
    Nire: string;
    MainActivity: string;
    MainActivityDescription: string;
    SecondaryActivity: string;
    SecondaryActivityDescription: string;
    DateFoundation: DateResultProps;
    PersonName: PersonNameResultProps;
    MotherName: {
      Full: string;
    };
    DOB: DateResultProps;
    Age: string;
    Gender: "F" | "M";
    Address: AddressResultProps;
    Email: EmailResultProps;
    PhoneNumber: PhoneNumberResultProps;
    PersonNameHistory: {
      Name: PersonNameResultProps[];
    };
    MobilePhoneNumber: PhoneNumberResultProps;
    AddressHistory: {
      Address: AddressResultProps[];
    };
    EmailHistory: {
      Email: EmailResultProps[];
    };
    PhoneNumberHistory: {
      PhoneNumber: PhoneNumberResultProps[];
    };
    MobilePhoneNumberHistory: {
      MobilePhoneNumber: PhoneNumberResultProps[];
    };
  };
  EnterpriseData: {
    Partnerships: {
      Partnership: PartnershipResultProps[];
    };
  };
  QuodScore: {
    Score: number;
    Segment: string;
    Message: string;
    CreditRisk: string;
    ProbabilityOfPayment: number;
  };
  Negative: {
    PendenciesControlCred: number;
    LawSuitApontamentos: LawSuitApontamentosResultProps[];
    CcfApontamentos: CcfApontamentosResultProps[];
    Apontamentos: ApontamentosResultProps[];
    Protests: {
      data_consulta: string;
      retorno: string;
      erro: string;
      erro_descricao: string;
      conteudo: {
        cartorio: [
          {
            codigo_cartorio: string;
            nome: string;
            telefone: string;
            endereco: string;
            uf: string;
            cidade: string;
            protestos: string;
          }
        ];
      };
    };
    TotalLawSuitApontamentos: number;
    TotalCcfApontamentos: number;
    TotalProtests: number;
    TotalValorApontamentos: number;
    TotalValorLawSuitApontamentos: number;
    TotalValorProtests: number;
  };
  Inquiries: {
    InquiryCountLast30Days: number;
    InquiryCountLast31to60Days: number;
    InquiryCountLast61to90Days: number;
    InquiryCountMore90Days: number;
    InquiryDetails: {
      InquiryDetail: InquiryDetailResultProps[];
    };
  };
  // Indicators: { Indicators: IndicatorsResultProps[], CountIndicators: number } | IndicatorsResultProps[]
  Indicators: any;
  ErrorMessage: string;
}

export interface queriesAttributes {
  id: string;
  type: "PF" | "PJ";
  status: "finished" | "waiting";
  cpf_cnpj: string;
  idCallManager: string;
  result_biro: ResultBiroProps;
  state_id: string;
  state?: stateProps;
  person_id: string;
  proposal_id: string;
  franchise_id: string;
  createdAt: string;
}

export interface properties_typesAttributes {
  id: string;
  name: string;
  qnt: number;
}

export interface IMapFieldsProps {
  keys: string[];
  name: string;
  valueKeys?: string[];
  labelKeys?: string[];
  options?: IOptionsProps[];
  isJson?: boolean;
  mask?: (value: any, extra?: boolean | undefined) => string;
}

export interface IMapOptionsProps {
  valueKeys: string[];
  labelKeys: string[];
  item: any;
}

export interface IMapDefaultFormProps {
  data: any;
  fields: IMapFieldsProps[];
}

export interface IOptionsProps {
  value: any;
  label: any;
  [key: string]: any;
}

export interface paymentsAttributes {
  id: string;
  type: "DC" | "DD" | "RC" | "RD" | "TB" | "DOC/TED" | "PIX";
  in_name: string;
  cpf_cnpj: string;
  bank_code: string;
  agency: string;
  account: string;
  operation: string;
  account_type: "CC" | "CP";
  [key: string]: any;
}

export interface apiError {
  path: string;
  message: string;
}

export interface optionRadioProps {
  id: string;
  label: string;
  value: string;
  type: "fixed" | "input";
}

export interface propertiesAttributes {
  id: string;
  friendly_id: string;
  identifier: string;
  rent_value: number;
  condo_value: number;
  is_managed: boolean;
  managed_type: "PORCEN" | "VALUE";
  managed_value: number;
  rental_fee_type: "PORCEN" | "VALUE";
  rental_fee_value: number;
  water: string;
  electricity: string;
  gas: string;
  iptu: string;
  iptu_value: any;
  metreage: number;
  localization_type: "URBAN" | "RURAL";
  destination_type:
  | "RESI"
  | "N_RESI"
  | "COMER"
  | "INDUS"
  | "TEMP"
  | "ENCOM"
  | "MISTO";
  address_id: string;
  broker_id: string;
  franchise_id: string;
  property_type_id: string;
  property_type?: properties_typesAttributes;
  owners: properties_customersAttributes[];
  address?: addressProps;
  status: "OCCUPIED" | "FREE";
}

export interface tabProps {
  label: string;
  canClick: boolean;
  open: boolean;
  [key: string]: any;
}

export interface properties_customersAttributes {
  id: string;
  porcen: number;
  type: "recipient" | "owner" | "owner_main" | undefined | null;
  customer_id: string;
  property_id: string;
  property?: propertiesAttributes;
  exibition: "grid" | "list";
  open: boolean;
  loading: boolean;
}
export interface fileProps {
  file: any;
  id: any;
  name: any;
  readableSize: any;
  preview: any;
  progress: any;
  uploaded: boolean;
  error: boolean;
  url: any;
}

export type ActivityTypes = 'RESERVATION_CREATE' | 'RESERVATION_PAID' | 'RESERVATION_CANCEL' | 'CHECKIN_DATE' | 'CHECKOUT_DATE' | 'CHECKIN_CREATE';

export interface INotificationProps {
  id: string;
  stays_id: string;
  number?: string;
  email?: string;
  message: string;
  title: string;
  to_send_date: Date;
  sent_at?: Date;
  status: "pending" | "sent" | "failed";
  stays_reservation_id?: string;
  notification_rules_id: string;
  activity: ActivityTypes;
  rule_name: string;
}

export interface INotificationRulesProps {
  id: string;
  name: string;
  accommodation?: IAccomodationsProps;
  group?: { name: string };
  model?: IMessageModels;
  send_type: 'email' | 'wpp';
  activity: ActivityTypes;
  time_mode: string;
  model_id: string;
  accommodation_id?: string;
  group_id?: string;
  recipient_type: 'guest' | 'other';
  time_send_notification: string;
}

export interface IAccomodationsProps {
  id: string;
  access_type: string;
  password: string;
  stays_id: string;
  bus_id: string;
  name: string;
  smartlock_alias?: string;
  areas_groups_ids?: string[];
  status: "active" | "hidden" | "inactive" | "draft";
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageModels {
  id: string;
  name: string;
  text: string;
  type: "email" | "whatsapp";
  createdAt: Date;
  updatedAt: Date;
}

export interface IStaysReservationProps {
  stays_id: string;
  accommodation_stays_id_code: string;
  id: string;
  bus_id: string;
  check_in_date: Date;
  check_out_date: Date;
  correct_realized_check_in: Date;
  correct_realized_check_out: Date;
  check_in_time: string;
  check_out_time: string;
  payment_status: string;
  reservation_status: string;
  accommodation_stays_id: string;
  guests: Guest[];
  origin: string;
  createdAt: Date;
  updatedAt: Date;
  check_in_status: 'pending' | 'done' | 'late';
  check_in: ICheckInsProps;
  check_out: ICheckInsProps;
}

export interface IBusinessProps {
  id: string;
  created_at: Date;
  plan_name: string;
  managed_accommodations: string;
  count_accommodations?: string;
  legal_name: string;
  trade_name: string;
  cnpj: string;
  phone: string;
  email: string;
  zip_code: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  address_complement: string;
  address_number: string;
  business_id: string;
  trust: boolean;
  name: string;
  logo: string;
  subscription_status: string;
  count_users: number;
}

export interface IPlanProps {
  id: string,
  name?: string,
  icon?: string,
  active?: boolean,
  is_test_free?: boolean,
  minimum_quantity_accommodation?: number,
  value?: number,
  value_extra_accommodation?: number,
  recurrence: number | null,
  frequency: number,
  permissions?: string[],
  description?: string,
}

export interface ICheckInsProps {
  id: string;
  accommodation_stays_id: string;
  reservation_stays_id: ReservationStaysID;
  accommodation: IAccomodationsProps;
  stays_reservations: IStaysReservationProps;
  createdAt: Date;
  updatedAt: Date;
  guests: Guest[];
}

export interface ICheckOutProps {
  id: string;
  accommodation_stays_id: string;
  reservation_stays_id: ReservationStaysID;
  accommodation: IAccomodationsProps;
  stays_reservations: IStaysReservationProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth: Date;
  document_type: string;
  document_value: string;
  document_image_front: null;
  document_image_back: null;
  selfie_image: null;
  createdAt: Date;
  updatedAt: Date;
  primary: boolean;
}

export interface ReservationStaysID {
  label: string;
  value: string;
}

export interface Address {
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  region: string;
  street: string;
  streetNumber: string;
  zip: string;
}


export interface bank_dataProps {
  id: string;
  type: "PIX" | "CC" | "CP";
  pix_type: "CA" | "CPF/CNPJ" | "PHONE" | "EMAIL" | null;
  pix_key: string;
  bank: string;
  agency: string;
  account: string;
}

export interface linksAttributes {
  id: string;
  views: number;
  bdi: number;
  franchise_id: string;
}


export interface ConstantsBusiness {
  MAX_PENDING_RESERVATIONS: number;
  DAYS_TO_NOTIFY_EXPIRES_POINTS: number;
  DAYS_TO_EXPIRES_POINTS: number;
  DAYS_TO_ENTER_POINTS: number;
  DAYS_TO_ABLE_CHECK_IN: number;
  HOURS_TO_EXPIRES_RESERVATION: number;
  CASHBACK_PERCENT: number;
  EXCHANGE_RATE: number;
  MAX_WALLET_USED_IN_RESERVATION: number;
  WPP_INSTANCE_NAME: string;
  WPP_INSTANCE_STATUS: 'connected' | 'disconnected' | string;
  NOTIFICATIONS_EMAIL: string;
  DAYS_TO_RESEND_NOTIFICATION: number;
  ENABLED_FACE_MATCH_CHECK_IN_USER: number;
  ENABLED_FACE_MATCH_CHECK_IN_ADM: number;
  ENABLED_CHECK_ONLY_STATUS_RESERVED: number;
  COMPANY_FANTASY_NAME: string;
  COMPANY_COLOR: string;
  COMPANY_LOGO: string;
  CHECKIN_TEXT_FISIC_KEY: string;
  CHECKIN_TEXT_PASSWORD_KEY: string;
  TIMEZONE: string;
}


export interface stateProps {
  id: string;
  name: string;
  initials: string;
}

export interface coefficientsAttributes {
  id: string;
  value: number;
  alternative_id: string;
  environment_id: string;
}
export interface finishesAttributes {
  id: string;
  order: number;
  label: string;
  states?: stateProps[];
}

export interface cityProps {
  id: string;
  name: string;
  state_id: string;
  state: stateProps;
}

export interface addressProps {
  id: string;
  cep: number;
  public_place: string;
  number: number;
  district: string;
  complement: string;
  city_id: string;
  state_id: string;
  city: cityProps;
  state: stateProps;
  [key: string]: any;
}

export interface registration_dataProps {
  id: string;
  type: "PJ" | "PF";
  name: string;
  phone: string;
  rg: string;
  issuing_body: string;
  cpf: string;
  birth: string;
  profession: string;
  nationality: string;
  marital_status: "married" | "single" | "separate" | "others";
  fantasy_name: string;
  corporate_name: string;
  cnpj: string;
  state_registration: string;
  municipal_registration: string;
  cellphone: string;
  email?: string;
  file?: fileProps;
  [key: string]: any;
}

export interface paymentsProps {
  id: string;
  type: "DC" | "DD" | "RC" | "RD" | "TB" | "DOC/TED" | "PIX";
  in_name: string;
  cpf_cnpj: string;
  bank_code: string;
  agency: string;
  account: string;
  operation: string;
  account_type: "CC" | "CP";
}

export interface transactionsAttributes {
  id: string;
  friendly_id: string;
  gateway_id: string | null;
  qrcode: string | null;
  qrcode_copy_and_paste: string | null;
  charge: string | null;
  quantity_accommodations: number | null;
  barcode: string | null;
  method: "credit_card" | "pix" | "mxs" | "free" | "banking_billet";
  card_flag: string;
  card_mask: string;
  data_payment: string | null;
  type: "increase" | "decrease";
  status:
  | "new"
  | "waiting"
  | "paid"
  | "unpaid"
  | "refunded"
  | "contested"
  | "canceled"
  | "settled"
  | "link"
  | "expired"
  | "identified"
  | "approved";
  value: number;
  description: string;
  franchise_id: string;
  subscription_id: string;
  query_id: string;
  contract_id: string;
  createdAt?: Date;
  updatedAt?: Date;
  query?: queriesAttributes;
  subscription?: subscriptionsAttributes;
  subscriptions?: subscriptionsAttributes;
  credit_card?: creditCardsAttributes;
}

export interface subscriptionsAttributes {
  id: string;
  gateway_id: string;
  card_flag: string;
  card_mask: string;
  status: "new" | "active" | "new_charge" | "canceled" | "expired";
  value: number;
  plan_id: string;
  next_execution: string;
  next_expire_at: string;
  plan?: plansAttributes;
  plans?: plansAttributes;
  transactions?: transactionsAttributes[];
  transaction?: transactionsAttributes[];
  situation:
  | "paid"
  | "paid-free"
  | "unpaid"
  | "waiting"
  | "waiting-alert"
  | "waiting-block"
  | "expired"
  | "canceled"
  | "not-have-transactions";
}

export interface creditCardsAttributes {
  id: string;
  card_flag: string;
  card_mask: string;
  payment_token: string;
  customer: string;
  billing_address: string;
}

export interface plansAttributes {
  id: string;
  gateway_id: string;
  icon: string;
  active: boolean;
  name: string;
  description: string;
  value: number;
  value_extra_accommodation: number;
  value_total_accommodation: number;
  frequency: number;
  recurrence: number | null;
  pj_unit_value: number;
  pf_unit_value: number;
  doc_unit_value: number;
  permissions: string | string[];
  contract_templates_limit: number;
  users_limit: number;
  cloud_limit: number;
  minimum_quantity_accommodation: number;
  createdAt?: Date;
  updatedAt?: Date;
}