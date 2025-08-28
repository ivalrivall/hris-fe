import { FC, useMemo, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '@metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser as apiCreateUser, updateUser as apiUpdateUser, updateUserAvatar as apiUpdateUserAvatar } from '../api'
import { useQueryResponse } from '../core/QueryResponseProvider'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Email is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(70, 'Maximum 70 characters')
    .required('Name is required'),
  phone: Yup.string().nullable(),
  password: Yup.string().min(6, 'Minimum 6 characters').notRequired(),
  password_confirmation: Yup.string()
    .test('passwords-match', 'Passwords must match', function (value) {
      const { password } = this.parent as { password?: string }
      if (!password) return true
      return value === password
    })
    .notRequired(),
  position: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(70, 'Maximum 70 characters')
    .required('Position is required'),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const userForEdit = useMemo<User>(() => ({
    ...user,
    avatar: user.avatar, 
    role: user.role ?? initialUser.role,
    position: user.position ?? initialUser.position,
    name: user.name ?? initialUser.name,
    email: user.email ?? initialUser.email,
    phone: user.phone ?? initialUser.phone,
    password: '',
    password_confirmation: '',
  }), [user])

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = userForEdit.avatar && userForEdit.avatar.length > 0
    ? userForEdit.avatar
    : blankImg
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const displayAvatarImg = avatarPreview ?? userAvatarImg

  const formik = useFormik({
    initialValues: userForEdit,
    enableReinitialize: true,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        const payload: User = { ...values }

        if (!isNotEmpty(payload.id)) {
          if (payload.password_confirmation == payload.password) {
            delete payload.password_confirmation
            await apiCreateUser(
              payload.email ?? '',
              payload.name ?? '',
              payload.position ?? '',
              payload.phone ?? '',
              payload.password ?? '',
            )
          }
        } else {
          const id = String(payload.id)
          const updateData: {
            name?: string
            email?: string
            position?: string
            phone?: string
            password?: string
            role?: string
          } = {
            name: payload.name,
            email: payload.email,
            position: payload.position,
            phone: payload.phone,
            role: payload.role,
          }
          if (payload.password) {
            if (payload.password == payload.password_confirmation) {
              delete payload.password_confirmation
              updateData.password = payload.password
            }
          }
          await apiUpdateUser(id, updateData, avatarFile ?? undefined)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='d-block fw-bold fs-6 mb-5'>Avatar</label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{ backgroundImage: `url('${blankImg}')` }}
            >
              {/* begin::Preview existing avatar */}
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{ backgroundImage: `url('${displayAvatarImg}')` }}
              ></div>
              {/* end::Preview existing avatar */}

              {/* begin::Label */}
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change avatar'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input
                  type='file'
                  name='avatar'
                  accept='.png, .jpg, .jpeg'
                  onChange={async (e) => {
                    const file = e.currentTarget.files?.[0] ?? null
                    setAvatarFile(file)

                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => setAvatarPreview(reader.result as string)
                      reader.readAsDataURL(file)
                    } else {
                      setAvatarPreview(null)
                    }

                    try {
                      const id = userForEdit.id
                      if (file && id) {
                        await apiUpdateUserAvatar(String(id), file)
                        refetch()
                      }
                    } catch (err) {
                      console.error('Failed to upload avatar', err)
                    }
                  }}
                />
                <input type='hidden' name='avatar_remove' />
              </label>
              {/* end::Label */}

              {/* begin::Cancel */}
              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='cancel'
                data-bs-toggle='tooltip'
                title='Cancel avatar'
              >
                <i className='bi bi-x fs-2'></i>
              </span>
              {/* end::Cancel */}

              {/* begin::Remove */}
              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove avatar'
              >
                <i className='bi bi-x fs-2'></i>
              </span>
              {/* end::Remove */}
            </div>
            {/* end::Image input */}

            {/* begin::Hint */}
            <div className='form-text'>Allowed file types: png, jpg, jpeg.</div>
            {/* end::Hint */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Full Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Full name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Phone</label>
            <input
              placeholder='Phone number'
              {...formik.getFieldProps('phone')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.phone && formik.errors.phone },
                {
                  'is-valid': formik.touched.phone && !formik.errors.phone,
                }
              )}
              type='tel'
              name='phone'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.phone}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Password</label>
            <input
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.password && formik.errors.password },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
              type='password'
              name='password'
              autoComplete='new-password'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            )}
            <div className='form-text'>Leave blank to keep the current password.</div>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Confirm Password</label>
            <input
              placeholder='Confirm password'
              {...formik.getFieldProps('password_confirmation')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.password_confirmation &&
                    formik.errors.password_confirmation,
                },
                {
                  'is-valid':
                    formik.touched.password_confirmation &&
                    !formik.errors.password_confirmation,
                }
              )}
              type='password'
              name='password_confirmation'
              autoComplete='new-password'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.password_confirmation as string}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Job Position</label>
            <input
              placeholder='Job position'
              {...formik.getFieldProps('position')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.position && formik.errors.position },
                {
                  'is-valid': formik.touched.position && !formik.errors.position,
                }
              )}
              type='text'
              name='position'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.position && formik.errors.position && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.position}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
