import { useFrappePostCall } from 'frappe-react-sdk'
import { toast } from 'sonner'
import { MdWatchLater } from 'react-icons/md'
import { FaCircleDot, FaCircleMinus } from 'react-icons/fa6'
import { BiSolidCircle } from 'react-icons/bi'
import { useCallback } from 'react'
import { DropdownMenu, Flex } from '@radix-ui/themes'
import { useUserData } from '@/hooks/useUserData'
import { GrPowerReset } from 'react-icons/gr'
import useCurrentRavenUser from '@/hooks/useCurrentRavenUser'

type AvailabilityStatus = 'Available' | 'Away' | 'Do not disturb' | 'Invisible' | ''

export const SetUserAvailabilityMenu = () => {

    const userData = useUserData()
    const { myProfile, mutate } = useCurrentRavenUser()

    const { call } = useFrappePostCall('frappe.client.set_value')
    const setAvailabilityStatus = useCallback((status: AvailabilityStatus) => {
        call({
            doctype: 'Raven User',
            name: userData.name,
            fieldname: 'availability_status',
            value: status
        }).then(() => {
            toast.success("User availability updated")
            mutate()
        })
    }, [userData.name])

    const getStatusText = (status: AvailabilityStatus) => {
        switch (status) {
            case 'Available':
                return <><BiSolidCircle color={'green'} fontSize={'0.7rem'} /> Available</>
            case 'Away':
                return <><MdWatchLater className={'text-amber-400'} fontSize={'0.75rem'} /> Away</>
            case 'Do not disturb':
                return <><FaCircleMinus className={'text-red-600'} fontSize={'0.6rem'} /> Do not disturb</>
            case 'Invisible':
                return <><FaCircleDot className={'text-gray-400'} fontSize={'0.6rem'} /> Invisible</>
            default:
                return <><BiSolidCircle color={'green'} fontSize={'0.7rem'} /> Available</>
        }
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
                <Flex gap={'2'} align='center'>{getStatusText(myProfile?.availability_status ?? '')}</Flex>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.Item className={'flex justify-normal gap-2'} color='gray' onClick={() => setAvailabilityStatus('Available')}>
                    {getStatusText('Available')}
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className={'flex justify-normal gap-2'} color='gray' onClick={() => setAvailabilityStatus('Away')}>
                    {getStatusText('Away')}
                </DropdownMenu.Item>
                <DropdownMenu.Item className={'flex justify-normal gap-2'} color='gray' onClick={() => setAvailabilityStatus('Do not disturb')}>
                    {getStatusText('Do not disturb')}
                </DropdownMenu.Item>
                <DropdownMenu.Item className={'flex justify-normal gap-2'} color='gray' onClick={() => setAvailabilityStatus('Invisible')}>
                    {getStatusText('Invisible')}
                </DropdownMenu.Item>
                <DropdownMenu.Item className={'flex justify-normal gap-2'} color='gray' onClick={() => setAvailabilityStatus('')}>
                    <GrPowerReset className={'text-gray-800'} fontSize={'0.65rem'} /> Reset
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    )
}