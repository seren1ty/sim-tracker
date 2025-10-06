import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Driver, Lap } from '@/types'

type LapMobileActionsProps = {
  sessionDriver: Driver | null | undefined
  lap: Lap
  deleteLap: (id: string) => void
  onClose: () => void
}

const LapMobileActions = (props: LapMobileActionsProps) => {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const onClickReplay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (props.lap.replay) {
      window.open(props.lap.replay)
    }
    props.onClose()
  }

  const onClickEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(
      {
        pathname: '/edit-lap/' + props.lap._id,
        query: { lap: JSON.stringify(props.lap) },
      },
      '/edit-lap/' + props.lap._id
    )
  }

  const onClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const onClickDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.deleteLap(props.lap._id)
    props.onClose()
  }

  const onClickDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const onClickCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onClose()
  }

  // Only show edit/delete for user's own laps
  const canEditLap = props.sessionDriver?.name === props.lap.driver

  return (
    <td className="lap-mobile-actions-cell" colSpan={10}>
      <div className="lap-mobile-actions-container">
        {!showDeleteConfirm ? (
          <>
            {props.lap.replay && (
              <div
                className="lap-mobile-action lap-mobile-replay"
                onClick={onClickReplay}
              >
                Replay
              </div>
            )}
            {canEditLap && (
              <>
                <div
                  className="lap-mobile-action lap-mobile-edit"
                  onClick={onClickEdit}
                >
                  Edit
                </div>
                <div
                  className="lap-mobile-action lap-mobile-delete"
                  onClick={onClickDelete}
                >
                  Delete
                </div>
              </>
            )}
            <button
              className="lap-mobile-cancel-link"
              onClick={onClickCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div
              className="lap-mobile-action lap-mobile-delete-confirm"
              onClick={onClickDeleteConfirm}
            >
              Delete
            </div>
            <button
              className="lap-mobile-cancel-link"
              onClick={onClickDeleteCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </td>
  )
}

export default LapMobileActions
