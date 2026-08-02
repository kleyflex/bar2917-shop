import { useRouter } from "next/navigation";
import { FC } from "react";
import { MdDeleteForever } from "react-icons/md";
import { RiEdit2Line, RiExternalLinkLine } from "react-icons/ri";

interface IAdminActions {
    viewUrl?: string;
    editUrl?: string;
    removeHandler?: () => void;
}

const AdminActions: FC<IAdminActions> = ({
    editUrl,
    viewUrl,
    removeHandler
}) => {
    const { push } = useRouter()

    return (
        <div className="flex-row gap-4 mr-2">
            {viewUrl && (
                <button type="button" aria-label="Открыть на сайте" onClick={() => push(viewUrl)}>
                    <RiExternalLinkLine size={22} className="hover:text-mainprimary"/>
                </button>
            )}
            {editUrl && (
                <button type="button" aria-label="Редактировать" onClick={() => push(editUrl)}>
                    <RiEdit2Line size={22} className="hover:text-mainprimary"/>
                </button>
            )}
            {removeHandler && (
                <button type="button" aria-label="Удалить" onClick={removeHandler}>
                    <MdDeleteForever size={22} className="hover:text-mainprimary"/>
                </button>
            )}
        </div>
    )
}

export default AdminActions
