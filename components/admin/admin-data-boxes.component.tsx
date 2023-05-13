import React, { useState } from 'react';
import Truncator from '@/components/common/truncator.component';
import { Tooltip } from 'react-tooltip';

type AdminBoxData = {
  _id: string;
  name: string;
  hasLaps?: boolean;
};

type AdminDataProps = {
  data: AdminBoxData[];
  showAdd: boolean;
  onUpdate: (dateItem: any) => void;
  onDelete: (dataItem: any, index: number) => void;
};

const AdminDataBoxes = (props: AdminDataProps) => {
  const [hoveredId, setHoveredId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItemName, setEditItemName] = useState('');

  const onHoverBox = (itemId: string) => {
    if (showConfirm || showEdit) return;

    setHoveredId(itemId);
  };

  const onLeaveBox = () => {
    if (showConfirm || showEdit) return;

    setHoveredId('');
  };

  const onClickDelete = () => {
    setShowConfirm(true);
  };

  const onClickDeleteConfirm = (dataItem: any, index: number) => {
    props.onDelete(dataItem, index);

    props.data.splice(index, 1);

    setShowConfirm(false);
    setHoveredId('');
  };

  const onClickDeleteCancel = () => {
    setShowConfirm(false);
  };

  /* const onClickEdit = (dataItem: AdminBoxData) => {
        setEditItemName(dataItem.name);

        setShowEdit(true);
    } */

  const onChangeEditItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditItemName(event.target.value);
  };

  const onClickEditConfirm = (dataItem: any) => {
    const newDataItem = { ...dataItem, name: editItemName };

    props.onUpdate(newDataItem);

    dataItem.name = editItemName;

    setShowEdit(false);
    setEditItemName('');
    setHoveredId('');
  };

  const onClickEditCancel = () => {
    setShowEdit(false);
  };

  if (!props.showAdd && (!props.data || props.data.length === 0))
    return (
      <React.Fragment>
        <div className="mt-2 ml-2">
          <strong>No data found.</strong>
        </div>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      {props.data?.map((dataItem, index) => {
        return (
          <div key={dataItem._id}>
            <div
              className={'data-box' + (!dataItem.hasLaps ? ' no-laps' : '')}
              id={'DataBox_' + dataItem._id}
              onClick={() => onHoverBox(dataItem._id)}
              onMouseEnter={() => onHoverBox(dataItem._id)}
              onMouseLeave={onLeaveBox}
              data-tip
              data-for={'dataItem_' + dataItem._id}
            >
              {(!showEdit || (showEdit && hoveredId !== dataItem._id)) && (
                <Truncator
                  id={'track_' + dataItem._id}
                  value={dataItem.name}
                  max={19}
                />
              )}
              {hoveredId === dataItem._id && (
                <div>
                  {!showEdit && (
                    <div>
                      {!showConfirm && (
                        <div>
                          {/* <div className="data-box-edit" onClick={() => onClickEdit(dataItem)}>Edit</div> */}
                          {!dataItem.hasLaps && (
                            <div
                              className="data-box-delete"
                              onClick={onClickDelete}
                            >
                              Delete
                            </div>
                          )}
                        </div>
                      )}
                      {showConfirm && (
                        <div>
                          <div
                            className="data-box-delete-confirm"
                            onClick={() =>
                              onClickDeleteConfirm(dataItem, index)
                            }
                          >
                            Delete
                          </div>
                          <div
                            className="data-box-delete-cancel"
                            onClick={onClickDeleteCancel}
                          >
                            Cancel
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {showEdit && (
                    <div>
                      <input
                        className="data-box-edit-input"
                        type="text"
                        value={editItemName}
                        onChange={onChangeEditItemName}
                      />
                      <div
                        className="data-box-edit-confirm"
                        onClick={() => onClickEditConfirm(dataItem)}
                      >
                        Update
                      </div>
                      <div
                        className="data-box-edit-cancel"
                        onClick={onClickEditCancel}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {!dataItem.hasLaps && hoveredId === dataItem._id && (
              <Tooltip id={'dataItem_' + dataItem._id} place="left">
                <span>Has no laps</span>
              </Tooltip>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default AdminDataBoxes;
