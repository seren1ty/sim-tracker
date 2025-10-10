import React, { useState } from 'react';
import { Driver } from '@/types';

type AdminDataEditDriverProps = {
  driver: Driver;
  onSave: (driver: Driver) => void;
  onCancel: () => void;
};

const AdminDataEditDriver = (props: AdminDataEditDriverProps) => {
  const [name, setName] = useState(props.driver.name);
  const [email, setEmail] = useState(props.driver.email || '');
  const [isAdmin, setIsAdmin] = useState(props.driver.isAdmin || false);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangeIsAdmin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(event.target.checked);
  };

  const onClickEditConfirm = () => {
    props.onSave({
      ...props.driver,
      name: name,
      email: email,
      isAdmin: isAdmin,
    });
  };

  const onClickEditCancel = () => {
    props.onCancel();
  };

  return (
    <>
      <div className="data-box edit driver">
        <input
          className="data-box-edit-input"
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="Name"
        />
        <input
          className="data-box-edit-input email"
          type="text"
          value={email}
          onChange={onChangeEmail}
          placeholder="Email"
        />
        <label className="data-box-edit-checkbox">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={onChangeIsAdmin}
          />
          <span className="checkbox-label">Is Admin</span>
        </label>
        <div
          className="data-box-edit-confirm"
          id="UpdateButton"
          onClick={onClickEditConfirm}
        >
          Update
        </div>
        <div
          className="data-box-edit-cancel"
          id="CancelButton"
          onClick={onClickEditCancel}
        >
          Cancel
        </div>
      </div>
    </>
  );
};

export default AdminDataEditDriver;
