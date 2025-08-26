import clsx from 'clsx'
import { FC } from 'react'
import { flexRender, Row } from '@tanstack/react-table'
import { UserModel } from '@modules/users/types'

// Accept any row shape; cells render using column defs

type Props = {
  row: Row<UserModel>
}

const CustomRow: FC<Props> = ({ row }) => (
  <tr>
    {row.getVisibleCells().map((cell) => {
      return (
        <td
          key={cell.id}
          className={clsx({ 'text-end min-w-100px': cell.column.id === 'actions' })}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      )
    })}
  </tr>
)

export { CustomRow }
