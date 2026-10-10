import Link from "next/link";

const LegalInfo = () => {              
    return(
        <>
            <div className="delivery__info">
                <h1>Правовая информация</h1>
                <div className="flex flex-col gap-6 text-gray-300">
                    <Link href='/legal/offer' className="hover:text-orange-400">
                        Публичная оферта
                    </Link>
                    <Link href='/legal/user-agreement' className="hover:text-orange-400">
                        Пользовательское соглашение
                    </Link>
                    <Link href='/legal/personal-data' className="hover:text-orange-400">
                        Условия обработки персональных данных
                    </Link>
                    <Link href='/legal/cookies' className="hover:text-orange-400">
                        Политика использования файлов cookie
                    </Link>
                </div>
            </div>
        </>
    )
}

export default LegalInfo;