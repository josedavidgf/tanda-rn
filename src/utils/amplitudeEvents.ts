export const EVENTS = {
    MONTHLY_STATS_CLICKED: 'Monthly stats button clicked',
    BULK_SHIFT_BUTTON_CLICKED: 'Bulk shift button clicked',
    BULK_SHIFT_DAY_TAP_CLICKED: 'Bulk shift day tap clicked',
    BULK_SHIFT_SAVE_BUTTON_CLICKED: 'Bulk shift save button clicked',
    BULK_SHIFT_CANCEL_BUTTON_CLICKED: 'Bulk shift cancel button clicked',
    ADD_SINGLE_SHIFT_BUTTON_CLICKED: 'Add single shift button clicked',
    ADD_SECOND_SHIFT_BUTTON_CLICKED: 'Add second shift button clicked',
    ADD_SINGLE_AVAILABILITY_BUTTON_CLICKED: 'Add single availability button clicked',
    SWITCH_AVAILABILITY_CLICKED: 'Switch availability chip clicked',
    PUBLISH_OWN_SHIFT_BUTTON_CLICKED: 'Publish own shift button clicked',
    PUBLISH_RECEIVED_SHIFT_BUTTON_CLICKED: 'Publish received shift button clicked',
    REMOVE_PUBLISH_OWN_SHIFT_BUTTON_CLICKED: 'Remove publish own shift button clicked',
    REMOVE_PUBLISH_RECEIVED_SHIFT_BUTTON_CLICKED: 'Remove publish received shift button clicked',
    SHOW_RECEIVED_SHIFT_DETAILS_BUTTON_CLICKED: 'Show received shift details button clicked',
    SHOW_SWAPPED_SHIFT_DETAILS_BUTTON_CLICKED: 'Show swapped shift details button clicked',
    DELETE_OWN_SHIFT_BUTTON_CLICKED: 'Delete own shift button clicked',
    EDIT_OWN_SHIFT_BUTTON_CLICKED: 'Edit own shift button clicked',
    CALENDAR_DAY_CLICKED: 'Calendar day clicked',
    PREV_MONTH_CLICKED: 'Prev month clicked',
    NEXT_MONTH_CLICKED: 'Next month clicked',
    ACTIVITY_LIST_BUTTON_CLICKED: 'Activity list button clicked',
    PROFILE_MENU_BUTTON_CLICKED: 'Profile menu button clicked',
    STATS_BUTTON_CLICKED: 'Stats button clicked',
    CALENDAR_TAB_CLICKED: 'Calendar icon clicked',
    HOSPITAL_SHIFTS_TAB_CLICKED: 'Hospital shifts tab clicked',
    MY_SWAPS_TAB_CLICKED: 'My swaps tab clicked',
    CHATS_LIST_TAB_CLICKED: 'Chats list tab clicked',
    REMOVE_ALL_AVAILABILITIES_CLICKED: 'Remove all availabilities clicked',
    PUBLISH_SHIFT_BUTTON_CLICKED: 'Publish shift button clicked',
    PAST_DAY_CLICKED: 'Past day clicked',
    SHIFTS_DATE_RANGE_FILTER_CHANGED: 'Shifts date range filter changed',
    SHIFT_TYPE_FILTER_CHANGED: 'Shift type filter changed',
    CLEAR_FILTERS_CLICKED: 'Clear filters clicked',
    SHIFT_CARD_CLICKED: 'Shift card clicked',
    SHIFT_CARD_DISABLED_CLICKED: 'Shift card disabled clicked',
    NO_SHIFTS_AVAILABLE: 'No shifts available',
    SWAP_PROPOSAL_SUBMITTED: 'Swap proposal submitted',
    SWAP_FEEDBACK_CTA_CLICKED: 'Swap feedback CTA clicked',
    SWAP_STATUS_FILTER_CHANGED: 'Swap status filter changed',
    SWAPS_DATE_RANGE_FILTER_CHANGED: 'Swaps date range filter changed',
    SWAP_CARD_CLICKED: 'Swap card clicked',
    SWAP_RESPONSE_SUBMITTED: 'Swap response submitted',
    SWAP_HELP_LINK_CLICKED: 'Swap help link clicked',
    CHAT_SEARCH_STARTED: 'Chat search started',
    CHAT_FILTER_CLEARED: 'Chat filter cleared',
    CHAT_CARD_CLICKED: 'Chat card clicked',
    TANDA_AI_CHAT_CLICKED: 'Tanda AI chat clicked',
    NO_CHATS_FOUND: 'No chats found with filters',
    CHAT_CALL_BUTTON_CLICKED: 'Chat call button clicked',
    LOGIN_BUTTON_CLICKED_FROM_HOME: 'Login button clicked from home',
    REGISTER_BUTTON_CLICKED_FROM_HOME: 'Register button clicked from home',
    LOGIN_ATTEMPTED_WITH_EMAIL: 'Login attempted with email',
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Login failed',
    FORGOT_PASSWORD_CLICKED: 'Forgot password link clicked',
    REGISTER_ATTEMPTED_WITH_EMAIL: 'Register attempted with email',
    REGISTER_SUCCESS: 'Register successful',
    REGISTER_FAILED: 'Register failed',
    FORGOT_PASSWORD_ATTEMPTED: 'Forgot password attempted',
    FORGOT_PASSWORD_SUCCESS: 'Forgot password success',
    FORGOT_PASSWORD_FAILED: 'Forgot password failed',
    VERIFY_EMAIL_RESEND_CLICKED: 'Verify email resend clicked',
    VERIFY_EMAIL_RESEND_SUCCESS: 'Verify email resend success',
    VERIFY_EMAIL_RESEND_FAILED: 'Verify email resend failed',
    ONBOARDING_CODE_SUBMITTED: 'Onboarding code submitted',
    ONBOARDING_CODE_SUCCESS: 'Onboarding code success',
    ONBOARDING_CODE_FAILED: 'Onboarding code failed',
    ONBOARDING_HELP_LINK_CLICKED: 'Onboarding help link clicked',
    ONBOARDING_CONFIRM_SUBMITTED: 'Onboarding confirm submitted',
    ONBOARDING_CONFIRM_SUCCESS: 'Onboarding confirm success',
    ONBOARDING_CONFIRM_FAILED: 'Onboarding confirm failed',
    ONBOARDING_CONTACT_CLICKED: 'Onboarding contact clicked',
    ONBOARDING_SPECIALITY_CONFIRMED: 'Onboarding speciality confirmed',
    ONBOARDING_SPECIALITY_FAILED: 'Onboarding speciality failed',
    ONBOARDING_NAME_SUBMITTED: 'Onboarding name submitted',
    ONBOARDING_NAME_SUCCESS: 'Onboarding name success',
    ONBOARDING_NAME_FAILED: 'Onboarding name failed',
    ONBOARDING_PHONE_SUBMITTED: 'Onboarding phone submitted',
    ONBOARDING_PHONE_FAILED: 'Onboarding phone failed',
    ONBOARDING_COMPLETED: 'Onboarding completed',
    ONBOARDING_SUCCESS_CONFIRMED: 'Onboarding success confirmed',
    ONBOARDING_SUCCESS_FAILED: 'Onboarding success failed',
    CONTACT_FORM_SUBMITTED: 'Contact form submitted',
    CONTACT_FORM_SUCCESS: 'Contact form success',
    CONTACT_FORM_FAILED: 'Contact form failed',
    DELETE_ACCOUNT_SUBMITTED: 'Contact form submitted',
    DELETE_ACCOUNT_SUCCESS: 'Contact form success',
    DELETE_ACCOUNT_FAILED: 'Contact form failed',
    PERSONAL_INFO_SUBMITTED: 'Personal info submitted',
    PERSONAL_INFO_NO_CHANGES: 'Personal info no changes',
    PERSONAL_INFO_SUCCESS: 'Personal info success',
    PERSONAL_INFO_FAILED: 'Personal info failed',
    COMM_PREF_TOGGLED: 'Communication preference toggled',
    COMM_PREF_SAVE_SUCCESS: 'Communication preference save success',
    COMM_PREF_SAVE_FAILED: 'Communication preference save failed',
    RESET_PASSWORD_SUBMITTED: 'Reset password submitted',
    RESET_PASSWORD_SUCCESS: 'Reset password success',
    RESET_PASSWORD_FAILED: 'Reset password failed',
    WORK_SETTINGS_EDIT_HOSPITAL_CLICKED: 'Work settings edit hospital clicked',
    WORK_SETTINGS_EDIT_SPECIALITY_CLICKED: 'Work settings edit speciality clicked',
    WORK_SETTINGS_CODE_SUBMITTED: 'Work settings code submitted',
    WORK_SETTINGS_CODE_FAILED: 'Work settings code failed',
    WORK_SETTINGS_CONFIRM_CODE_ACCEPTED: 'Work settings confirm code accepted',
    WORK_SETTINGS_SPECIALITY_SELECTED: 'Work settings speciality selected',
    WORK_SETTINGS_SAVE_CHANGES_SUBMITTED: 'Work settings save changes submitted',
    WORK_SETTINGS_SAVE_CHANGES_SUCCESS: 'Work settings save changes success',
    WORK_SETTINGS_SAVE_CHANGES_FAILED: 'Work settings save changes failed',
    LEGAL_TERMS_CLICKED: 'Legal terms clicked',
    LEGAL_PRIVACY_CLICKED: 'Legal privacy clicked',
    LOGOUT_CLICKED: 'Logout clicked',
    EDIT_PUBLISH_OWN_SHIFT_BUTTON_CLICKED: 'Edit publish own shift button clicked',
    REJECT_SWAP_BUTTON_CLICKED: 'Reject swap button clicked',
    ACCEPT_SWAP_BUTTON_CLICKED: 'Accept swap button clicked',
    CANCEL_SWAP_BUTTON_CLICKED: 'Cancel swap button clicked',
    EDIT_SHIFT_SAVE_BUTTON_CLICKED: 'Edit shift save button clicked',
    HOSPITAL_SHIFTS_FILTER_NO_RETURN_TOGGLED: 'Hospital shifts filter no return toggled',
    HOSPITAL_SHIFTS_FILTER_TYPE_TOGGLED: 'Hospital shifts filter type toggled',
    COMMENT_BUTTON_CLICKED: 'Comment button clicked',
    SHARED_REFERRAL_CODE: 'Shared referral code',
    ONBOARDING_MANUAL_SELECTION: 'Onboarding manual selection',
    ONBOARDING_MANUAL_SELECTION_SUCCESS: 'Onboarding manual selection success',
    ONBOARDING_MANUAL_SELECTION_FAILED: 'Onboarding manual selection failed',
}