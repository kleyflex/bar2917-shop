import { getLocations, getMenuCategories, getServerLocationId } from "@/app/api/server-api"
import MainLayout from "@/components/layouts/MainLayout"
import NotFoundAny from "@/components/templates/NotFoundPage/NotFoundAny"

// Несуществующий URL: сюда не доходит layout группы (shop), поэтому оболочка подключается вручную
export default async function NotFound() {
    const locationId = await getServerLocationId()
    const categories = await getMenuCategories(locationId)
    const locations = await getLocations()

    return (
        <MainLayout categories={categories} locations={locations} serverLocationId={locationId}>
            <NotFoundAny />
        </MainLayout>
    )
}
