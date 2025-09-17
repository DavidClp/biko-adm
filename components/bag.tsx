import React, { useCallback, useEffect, useImperativeHandle, useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Tooltip } from "./ui/tooltip";
import { Button } from "./ui/button";

interface IBag {
    title: string
    description: any
    icon?: any
    children?: any
    everOpen?: boolean
    defaultOpen?: boolean
}

export interface IBagRef {
    openBag: () => void
    closeBag: () => void
}

const BagComponent: React.ForwardRefRenderFunction<IBagRef, IBag> = (props, ref) => {
    const { children, everOpen = false, description, icon, title, defaultOpen = true } = props

    const div_ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(everOpen);
    const [firstRender, setFirstRender] = useState(true);

    const getHeight = useCallback(() => {
        return div_ref.current ? div_ref.current.offsetHeight : 0
    }, [div_ref])

    const closeBag = useCallback(() => { setOpen(false) }, [])

    const openBag = useCallback(() => { setOpen(true) }, [])

    useEffect(() => {
        if (firstRender && defaultOpen) {
            setOpen(true)
            setFirstRender(() => false)
        }
    }, [firstRender, defaultOpen])

    useImperativeHandle(ref, () => ({ openBag, closeBag }))

    return (
        <div className="cursor-pointer border border-gray-400 rounded-md">
            <div className="p-4 gap:1 md:gap2.5 flex items-center justify-between" onClick={() => everOpen ? {} : setOpen((atual) => !atual)}>
                <div className="gap-2.5 items-center flex">
                    {icon && (
                        <div className="flex items-center justify-center" style={{ minWidth: 36, maxWidth: 36 }}>
                            {icon}
                        </div>
                    )}
                    <div className="gap-1 flex flex-col">
                        <p className="text-[14px] md:text-[16px] font-semibold">{title}</p>
                        <p className="text-[14px] md:text-[16px] font-normal">{description}</p>
                    </div>
                </div>
                {!everOpen &&
                    <Button aria-label={open ? "Fechar" : "Abrir"} variant="link" style={{ padding: 3 }}>
                        <div className="open={open}">
                            <IoIosArrowDown
                                color={'#3a3a3a'}
                                size={16}
                                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease-in-out' }}
                            />
                        </div>
                    </Button>
                }
            </div>

            <div
                className={`relative overflow-hidden transition-all ${everOpen ? 'duration-0' : 'duration-300'       }`}
                style={{ height: open ? `${getHeight()}px` : '0px' }}
            >
                <div ref={div_ref}>
                    {children}
                </div>
            </div>

        </div>
    )
}

export const Bag = React.forwardRef(BagComponent)