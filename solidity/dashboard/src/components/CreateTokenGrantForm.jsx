import React, { useContext } from 'react'
import { SubmitButton } from './Button'
import FormInput from './FormInput'
import FormCheckbox from './FormCheckbox'
import { withFormik } from 'formik'
import {
  validateAmountInRange,
  validateEthAddress,
  getErrorsObj,
  validateRequiredValue,
} from '../forms/common-validators'
import { useCustomOnSubmitFormik } from '../hooks/useCustomOnSubmitFormik'
import moment from 'moment'
import { Web3Context } from './WithWeb3Context'
import { tokenGrantsService } from '../services/token-grants.service'
import { useShowMessage, messageType } from './Message'
import ProgressBar from './ProgressBar'
import { colors } from '../constants/colors'
import { formatAmount, displayAmount } from '../utils/general.utils.js'
import {
  normalizeAmount,
  formatAmount as formatFormAmount,
} from '../forms/form.utils.js'

const CreateTokenGrantForm = ({
  keepBalance,
  successCallback,
  ...formikProps
}) => {
  const web3Context = useContext(Web3Context)
  const showMessage = useShowMessage()
  const amount = formatAmount(formikProps.values.amount)

  const submit = async (values, onTransactionHashCallback) => {
    try {
      await tokenGrantsService.createGrant(web3Context, values, onTransactionHashCallback)
      showMessage({ type: messageType.SUCCESS, title: 'Success', content: 'Grant tokens transaction has been successfully completed' })
    } catch (error) {
      showMessage({ type: messageType.ERROR, title: 'Grant tokens action has been failed ', content: error.message })
      throw error
    }
  }
  const onSubmit = useCustomOnSubmitFormik(submit)

  return (
    <form>
      <FormInput
        name="grantee"
        type="text"
        label="Grantee Address"
      />
      <FormInput
        name="amount"
        type="text"
        label="Amount"
        normalize={normalizeAmount}
        format={formatFormAmount}
      />
      <div className="text-smaller text-grey-50">
        {displayAmount(keepBalance)} KEEP available
      </div>
      <ProgressBar
        total={keepBalance}
        items={[{ value: amount, color: colors.primary }]}
      />
      <FormInput
        name="duration"
        type="text"
        label="Duration (Duration in seconds of the period in which the tokens will unlock)"
      />
      <FormInput
        name="start"
        type="text"
        label="Start (Timestamp at which unlocking will start)"
      />
      <FormInput
        name="cliff"
        type="text"
        label="Cliff (Duration in seconds of the cliff after which tokens will begin to unlock)"
      />
      <FormCheckbox
        name="revocable"
        type="checkbox"
        label="Revocable (Whether the token grant is revocable or not)"
      />
      <SubmitButton
        className="btn btn-primary"
        type="submit"
        onSubmitAction={onSubmit}
        withMessageActionIsPending={false}
        triggerManuallyFetch={true}
        successCallback={successCallback}
      >
        grant tokens
      </SubmitButton>
    </form>
  )
}

const connectedWithFormik = withFormik({
  mapPropsToValues: () => ({
    grantee: '0x0',
    amount: '0',
    duration: '',
    start: moment().unix(),
    cliff: '',
    revocable: true,
  }),
  validate: (values, props) => {
    const { keepBalance } = props
    const {
      grantee,
      amount,
      duration,
      start,
      cliff,
    } = values
    const errors = {}
    errors.grantee = validateEthAddress(grantee)
    errors.amount = validateAmountInRange(amount, keepBalance, 1)
    errors.duration = validateRequiredValue(duration)
    errors.start = validateRequiredValue(start)
    errors.cliff = validateRequiredValue(cliff)

    return getErrorsObj(errors)
  },
  displayName: 'CrateGrantForm',
})(CreateTokenGrantForm)

export default connectedWithFormik
