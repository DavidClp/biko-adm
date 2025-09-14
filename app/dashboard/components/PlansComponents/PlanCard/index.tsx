import React from "react";
import parse from "html-react-parser";
import { IPlan } from "@/hooks/use-subscriptions";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaBoxes } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaToilet } from "react-icons/fa";
import { TbHandStop } from "react-icons/tb";
import { IoIosDesktop } from "react-icons/io";
import { BiCar, BiCloset, BiHome } from "react-icons/bi";
import { IoAirplaneOutline, IoBed } from "react-icons/io5";
import { GiBathtub, GiHomeGarage, GiSofa } from "react-icons/gi";
import { FaFaucet, FaLayerGroup, FaLightbulb, FaPalette, FaWarehouse } from "react-icons/fa";
import { MdKitchen, MdLocalLaundryService, MdOutdoorGrill, MdOutlinePedalBike, MdPool } from "react-icons/md";
import { maskFunctions } from "@/lib/maskServices";

interface IPlanCard {
    plan: IPlan
    selected: boolean
    onClick: Function
}
/* ------------------------------------ */

const tertiary = "#07C5A6";
const four = "#394F8F";

const fail = "#FF6B6B";
const success = "#52C41A";
const info = "#FAAD14";

const gray = "#DBDBDB";
const white = "#FFF";
const backScan = "#BDE5F3";

const inactiveItens = {
    light: "#3a3a3a",
    dark: "#8A8A8A",
};

export const background = {
    light: "#f8f8f8",
    dark: "#1B191B",
};

/* ------------------------------------ */

const getPartIntAndDecimal = (value: string) => {
    let partInt = value.split(",")[0].replace(/\D+/g, "")
    let partDecimal = value.split(",")[1].replace(/\D+/g, "")

    return (
        <>
            R$ <b style={{ fontSize: 36 }}>{partInt},</b>{partDecimal}
        </>
    )
}

export const PlanCard: React.FC<IPlanCard> = (props) => {
    const { plan, selected, onClick } = props

    return (
       /*  ${props => css`
            border: 2px solid ${primary[props.theme as themeTypes]};
            background: ${primary[props.theme as themeTypes]};
            box-shadow:0.125rem 0.125rem 0.5rem ${shadowColor[props.theme as themeTypes]};
        `}
        ${props => props.selected && css`
            border: 2px solid ${secondary[props.theme as themeTypes]};
        `} */
        <div 
            className={`rounded-md flex flex-col cursor-pointer p-5 min-w-[300px] flex-1 ${selected ? "border-2 border-primary" : ""}`} 
            style={{ boxShadow: "0.125rem 0.125rem 0.5rem rgba(0,0,0,0.1)" }}
            onClick={() => onClick(plan?.id)}
      >
            <div style={{ display: "flex", whiteSpace: "nowrap", justifyContent: "flex-end", gap: 10 }}>
                {selected &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 20, maxWidth: 20, minHeight: 20, maxHeight: 20, borderRadius: "50%", boxShadow: "rgb(187 187 187 / 70%) 0.125rem 0.125rem 0.5rem" }}>
                        <AiFillCheckCircle style={{ width: 20, height: 20 }} className="text-primary" />
                    </div>}
                {!selected && <div style={{ width: 20, height: 20, borderRadius: "50%", boxShadow: "rgb(187 187 187 / 70%) 0.125rem 0.125rem 0.5rem" }} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, gap: 10 }}>
                <div className="bg-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 100, maxWidth: 100, minHeight: 100, maxHeight: 100, borderRadius: "50%" }}>
                    <PlanIcons type={plan?.icon || ''} size={70} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="text-primary" style={{ fontWeight: 600, fontSize: 22, textAlign: "center" }}>{plan?.name?.toUpperCase()}</div>
                    <div style={{ opacity: 0.5, marginTop: -5, }}>Plano mensal</div>
                </div>
                <div className="text-primary" style={{ fontWeight: 600, fontSize: 22, marginTop: -10 }}>
                    {getPartIntAndDecimal(maskFunctions.currency.mask(plan?.value))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {parse(plan?.description || '')}
            </div>
        </div>
    )
}

export const PlanIcons: React.FC<{ type: string, size: number, opacity?: number }> = ({ size, type, opacity = 1 }) => {
    if (type === "FaCar") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <BiCar size={size} />
            </div>
        )
    }
    else if (type === "FaAirPlane") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity, rotate: "-45deg" }}>
                <IoAirplaneOutline size={size} />
            </div>
        )
    }
    else if (type === "TbHandStop") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <TbHandStop size={size} />
            </div>
        )
    }
    else if (type === "MdOutlinePedalBike") {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF", opacity: opacity }}>
                <MdOutlinePedalBike size={size} />
            </div>
        )
    }
    return <></>
}