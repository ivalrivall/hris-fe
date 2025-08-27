import React, { FC } from 'react';
import { flexRender, Header } from '@tanstack/react-table';
import { UserModel } from '@modules/users/types';

type Props = {
  header: Header<UserModel, unknown>;
};

const CustomHeaderColumn: FC<Props> = ({ header }) => {
  return <>
    {flexRender(
      header.column.columnDef.header,
      header.getContext()
    )}
  </>;
};

export { CustomHeaderColumn };
