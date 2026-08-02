import { FolderNameForImage } from '@/app/constants/app.constants';
import Image from 'next/image';
import { FC } from "react";
import AdminActions from "./admin-actions/AdminActions";
import { IAdminListItem } from "./admin-list.interface";


const SERVER_URL_FOR_IMAGE = process.env.NEXT_PUBLIC_SERVER_URL_IMAGE as string

const AdminListItem: FC<IAdminListItem> = ({removeHandler, listItem}) => {
    const imageUrl = `${SERVER_URL_FOR_IMAGE}/${FolderNameForImage}`;
    return (
        <div>
        <div className="flex-row w-7/12 p-2 h-20 items-center border border-card-border bg-background-card rounded-lg justify-between">
            <div className="w-7/12 flex-row">
            {listItem.items.length > 0 && (
                <div key={listItem.items[0]}> {/* Настройка первого элемента */}
                <Image src={`${imageUrl}/${listItem.items[0]}`} className="rounded-lg" alt="Image" height={120} width={120} />
                </div>
            )}
            {listItem.items.length > 1 && (
                <div className='ml-2 justify-center gap-3'> {/* Общий контейнер для второго и всех последующих элементов */}
                {listItem.items.slice(1).map((value, index) => (
                    <div key={value} className={index === 0 ? 'text-orange-500' : ''}> {/* Настройка второго элемента и всех остальных элементов */}
                    <div>{value}</div>
                    </div>
                ))}
                </div>
            )}
            </div>

            <AdminActions 
            viewUrl={listItem.viewUrl}
            editUrl={listItem.editUrl}
            removeHandler={removeHandler}
            />
        </div>
        </div>
    )
}

export default AdminListItem