import React, { useState, useEffect } from 'react';
import Truncator from '@/components/common/truncator.component';

type AdminBoxData = {
  _id: string;
  name: string;
  hasLaps?: boolean;
};

type AdminDataProps = {
  data: AdminBoxData[];
  showAdd: boolean;
  dataType?: string; // 'Drivers' or 'Groups' for complex edit, undefined for simple edit
  onUpdate: (dateItem: any) => void;
  onDelete: (dataItem: any, index: number) => void;
  editingItemId?: string | null; // ID of the item currently being edited (for complex edits)
  editComponent?: React.ReactNode; // The edit component to render inline (for complex edits)
};

const AdminDataBoxes = (props: AdminDataProps) => {
  const [focusedId, setFocusedId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editItemId, setEditItemId] = useState('');
  const [previousEditingItemId, setPreviousEditingItemId] = useState<string | null | undefined>(undefined);

  // Reset hover state when complex edit is canceled (editingItemId changes from value to null/undefined)
  useEffect(() => {
    // Only reset if we were editing something and now we're not (cancel was clicked)
    if (previousEditingItemId && !props.editingItemId && focusedId === previousEditingItemId) {
      // Complex edit was just canceled, reset focus state
      setFocusedId('');
    }
    // Track the previous value for next comparison
    setPreviousEditingItemId(props.editingItemId);
  }, [props.editingItemId]);

  const onFocusBox = (itemId: string) => {
    if (showConfirm || showEdit) return;

    setFocusedId(itemId);
  };

  const onHoverBox = (itemId: string) => {
    if (showConfirm || showEdit) return;

    setFocusedId(itemId);
  };

  const onLeaveBox = () => {
    if (showConfirm || showEdit) return;

    setFocusedId('');
  };

  const onClickDelete = () => {
    setShowConfirm(true);
  };

  const onClickDeleteConfirm = (dataItem: any, index: number) => {
    props.onDelete(dataItem, index);

    props.data.splice(index, 1);

    setShowConfirm(false);
    setFocusedId('');
  };

  const onClickDeleteCancel = () => {
    setShowConfirm(false);
    setFocusedId('');
  };

  const onClickEdit = (dataItem: AdminBoxData) => {
    // For complex edits (Drivers, Groups), call the parent's onUpdate directly
    // For simple edits (Tracks, Cars, Games), use local inline editing
    if (!isSimpleEdit) {
      props.onUpdate(dataItem);
      return;
    }

    setEditItemName(dataItem.name);
    setEditItemId(dataItem._id);
    setShowEdit(true);
  };

  const onChangeEditItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditItemName(event.target.value);
  };

  const onClickEditConfirm = (dataItem: any) => {
    const newDataItem = { ...dataItem, name: editItemName };

    props.onUpdate(newDataItem);

    dataItem.name = editItemName;

    setShowEdit(false);
    setEditItemName('');
    setFocusedId('');
  };

  const onClickEditCancel = () => {
    setShowEdit(false);
    setEditItemName('');
    setEditItemId('');
    setFocusedId('');
  };

  // For simple edit (name only), used by Tracks, Cars, Games
  const isSimpleEdit = !props.dataType ||
    (props.dataType !== 'Drivers' && props.dataType !== 'Groups');

  if (!props.showAdd && (!props.data || props.data.length === 0))
    return (
      <>
        <div className="mt-2 ml-2">
          <strong>No data found.</strong>
        </div>
      </>
    );

  return (
    <>
      {props.data?.map((dataItem, index) => {
        const isEditingThisItem = editItemId === dataItem._id && isSimpleEdit;
        const isComplexEditingThisItem = props.editingItemId === dataItem._id && !isSimpleEdit;

        // For complex edits, render the edit component instead of the data box
        if (isComplexEditingThisItem) {
          return <div key={dataItem._id}>{props.editComponent}</div>;
        }

        return (
          <div key={dataItem._id}>
            {isComplexEditingThisItem && <div>{props.editComponent}</div>}
            <div
              className={
                'data-box' +
                (!dataItem.hasLaps ? ' no-laps' : '') +
                (isEditingThisItem ? ' editing' : '')
              }
              id={'DataBox_' + dataItem._id}
              onClick={() => onFocusBox(dataItem._id)}
              onMouseEnter={() => onHoverBox(dataItem._id)}
              onMouseLeave={onLeaveBox}
              data-tip
              data-tooltip-id={'dataItem_' + dataItem._id}
            >
              {(!showEdit || (showEdit && editItemId !== dataItem._id)) && (
                <Truncator
                  id={'track_' + dataItem._id}
                  value={dataItem.name}
                  max={19}
                />
              )}
              {isEditingThisItem && (
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
              {focusedId === dataItem._id && !showEdit && (
                <div>
                  {!showEdit && (
                    <div>
                      {!showConfirm && (
                        <div>
                          <div className="data-box-edit" onClick={() => onClickEdit(dataItem)}>Edit</div>
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
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AdminDataBoxes;
