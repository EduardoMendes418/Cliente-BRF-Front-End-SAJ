import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors"
import { getNotificationFilterGoodsGuaranteesRequest, getNotificationsGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors"
import { fetchNotificationList } from "src/core/store/modules/goods-guarantee/thunks"
import { actions } from 'src/core/store'


export default function useUserNotifications() {
	const dispatch = useDispatch()

	const { id: userId } = useSelector(getDataCurrentUser)
	const filters = useSelector(getNotificationFilterGoodsGuaranteesRequest)
	const notifications = useSelector(getNotificationsGoodsGuaranteesRequest)

	const [transientNotifications, setTransientNotifications] = useState(notifications || [])

	useEffect(() => {
		if (userId)
			dispatch(actions.goodsGuaranteesRequest.setNotificationFilters({ userId, page: 1, pageSize: 20 }))
	}, [dispatch, userId])

	useEffect(() => {
		if (filters)
			dispatch(fetchNotificationList(filters))
	}, [dispatch, filters])

	useEffect(() => {
		setTransientNotifications(notifications)
	}, [notifications])

	const removeTransientNotification = useCallback((id: number) => {
		setTransientNotifications(transientNotifications.filter((noti) => noti.id !== id))
	}, [transientNotifications])

	return {
		notifications: transientNotifications,
		removeTransientNotification,
	}
}
