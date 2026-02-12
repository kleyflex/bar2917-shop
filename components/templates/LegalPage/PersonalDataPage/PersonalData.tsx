import MainLayout from "@/components/layouts/MainLayout";

const PersonalData = () => {
    return(
        <MainLayout>
            <div className="public_offer max-w-5xl ml-5">
                <h1 className="max-w-5xl tracking-[0.2] leading-[1.5]">
                    Политика обработки персональных данных
                </h1>​
                <div className="text-base leading-relaxed space-y-4">
                    <h2 className="text-xl font-semibold mt-3 mb-3">1. Общие положения</h2>
                    <p>1.1. Настоящая Политика обработки персональных данных (далее – "Политика") регулирует правоотношения по обработке персональных данных между пользователем сети "Интернет", клиентами в оффлайн суши-барах (далее – "Клиент") при использовании всех наших сервисов и Индвидуальным предпринимателем (далее – "ИП").</p>
                    <p>1.2. К Сервисам относятся следующий веб-сайт:</p>
                    <p>1.2.1. сайт Суши-бар Bar2917 - https://bar2917.ru/ (далее – "Сайт");</p>

                    <p>Перечень Сервисов не является исчерпывающим и время от времени с развитием новых направлений может изменяться, к новым сервисам будут применяться положения Политики.</p>

                    <p>1.3. Клиент обязан полностью ознакомиться с настоящей Политикой до момента использования Сервисов, а также со следующими правовыми документами ИП:</p>
                    <ul className="list-disc list-inside">
                        <li><a href="http://bar2917.ru/legal/offer" target="_blank" rel="noopener noreferrer">Публичная оферта о продаже товаров дистанционным способом;</a></li>
                        <li><a href="http://bar2917.ru/legal/user-agreement" target="_blank" rel="noopener noreferrer">Пользовательское соглашение;</a></li>
                        <li><a href="http://bar2917.ru/legal/cookies" target="_blank" rel="noopener noreferrer">Политика использования файлов cookies;</a></li>
                    </ul>
                    
                    <h2 className="text-xl font-semibold mt-3 mb-3">Что такое cookies?</h2>
                    <p>Файлы cookies — это небольшие файлы данных, которые сохраняются на вашем компьютере или мобильном устройстве при посещении Сайта. Файлы cookies используются владельцами сайтов для обеспечения работы своих сайтов или повышения эффективности их работы, а также для предоставления отчетной информации.</p>
                    <p>Файлы cookies обладают множеством различных функций, например, позволяют вам эффективно перемещаться между страницами, запоминать ваши предпочтения и в целом улучшать работу с пользователем. Они также могут помочь сделать рекламу, которую вы видите в Интернете, более актуальной для вас и ваших интересов.</p>
                    <p>Файлы cookies, устанавливаемые владельцем веб-сайта, называются "файлы cookies первых лиц". Файлы cookies, устанавливаемые лицами, отличными от владельца сайта, называются "файлы cookies третьих лиц". Файлы cookies третьих лиц позволяют предоставлять сторонние функции на сайте или через него (например, рекламу, интерактивный контент и аналитику). Стороны, установившие эти сторонние файлы cookies, могут распознавать ваш компьютер или мобильное устройство как при посещении соответствующих сайтов, так и при посещении определенных других веб-сайтов.</p>

                    <h2 className="text-xl font-semibold mt-3 mb-3">Как мы используем файлы cookies?</h2>
                    <p>Когда вы посещаете наш Сайт, мы можем размещать следующие типы файлов cookies:</p>
                    
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Категории cookies</th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Описание и цель использования</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700 font-medium">Технические cookies</td>
                                    <td className="py-3 px-4 text-gray-600">Эти файлы cookies необходимы для функционирования веб-сайта и они не могут быть отключены с помощью баннера cookies. Обычно они используются только для обеспечения надлежащего обслуживания сайта. Вы можете настроить свой браузер таким образом, чтобы он блокировал или предупреждал вас об этих файлах cookies, но это может привести к неправильной работе некоторых частей Сайта.</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700 font-medium">Функциональные cookies</td>
                                    <td className="py-3 px-4 text-gray-600">Эти файлы cookies помогают улучшить функциональность веб-сайта. Например, функциональные файлы cookies используются для того, чтобы вы могли использовать наши функции расширенного поиска и фильтрации, помогая вам быстро и эффективно находить товары.</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700 font-medium">Аналитические cookies</td>
                                    <td className="py-3 px-4 text-gray-600">Используя эти файлы cookies, мы можем подсчитывать количество посещений и источники трафика, чтобы иметь возможность оценивать и улучшать производительность нашего Сайта.</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700 font-medium">Маркетинговые cookies</td>
                                    <td className="py-3 px-4 text-gray-600">Эти файлы cookies помогают нам (предоставляют вам персонализированную рекламу и анализируют эффективность наших маркетинговых кампаний).</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-xl font-semibold mt-3 mb-3">Как я могу контролировать файлы cookies?</h2>
                    <p>Вы имеете право решать, принимать или отклонять определенные типы файлов cookies, за исключением технических файлов cookies. Вы можете использовать свои предпочтения в отношении файлов cookies на баннере cookies, который появляется при первом посещении нашего Сайта.</p>
                    <p>Вы в любое время можете самостоятельно ограничить или полностью отключить установку cookies через настройки вашего веб-браузера. Чтобы узнать о том, как это сделать, воспользуйтесь следующими ссылками:</p>
                    <ul className="list-disc list-inside">
                        <li><a href="https://support.google.com/chrome/answer/95647?hl=ru&co=GENIE.Platform%3DDesktop" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                        <li><a href="https://support.mozilla.org/ru/kb/udalenie-kukov-i-dannyh-sajtov-v-firefox?redirectslug=udalenie-kuki-i-dannyh-sajtov-v-firefox&redirectlocale=ru" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                        <li><a href="https://support.microsoft.com/ru-ru/windows/%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%84%D0%B0%D0%B9%D0%BB%D0%B0%D0%BC%D0%B8-cookie-%D0%B2-microsoft-edge-%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80-%D1%80%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0-%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B8-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                        <li><a href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                    </ul>
                    <p>Если вы решите отказаться от использования файлов cookie, вы по-прежнему можете пользоваться нашим Сайтом, хотя ваш доступ к некоторым функциям и разделам нашего Сайта может быть ограничен.</p>
                
                    <h2 className="text-xl font-semibold mt-3 mb-3">Обновления Политики</h2>
                    <p>Мы можем время от времени обновлять эту Политику в ответ на изменения юридического или технического характера.</p>
                </div>
            </div>
        </MainLayout>
    );
}

export default PersonalData;