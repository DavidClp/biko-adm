import React, { useCallback, useEffect, useImperativeHandle, useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

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
        <div className="">
            <div className="p-4 gap2.5 items-center justify-between" onClick={() => everOpen ? {} : setOpen((atual) => !atual)}>
                <div className="gap-2.5 items-center flex">
                    {icon && (
                        <div className="flex items-center justify-center" style={{ minWidth: 36, maxWidth: 36 }}>
                            {icon}
                        </div>
                    )}
                    <div className="gap-2 flex flex-col">
                        <p className="font-semibold">{title}</p>
                        <p className="font-normal">{description}</p>
                    </div>
                </div>
               {/*  {!everOpen &&
                    <Tooltip title={open ? "Fechar" : "Abrir"} style={{ width: 30, height: 30 }}>
                        <IconButton aria-label={open ? "Fechar" : "Abrir"}>
                            <ContainerArrow open={open}>
                                <IoIosArrowDown
                                    color={inactiveItens['light']}
                                    size={16}
                                />
                            </ContainerArrow>
                        </IconButton>
                    </Tooltip>
                } */}
            </div>


                <div 
                    className={`relative overflow-hidden transition-all ${
                        everOpen ? 'duration-0' : 'duration-300'
                    }`}
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