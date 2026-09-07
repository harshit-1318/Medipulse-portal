# 6. Acceptance Criteria

Use this checklist to verify feature completion across Survey Management, Distribution, Fill Page, Responses, and Lead Management.

---

## 6.1 Survey Management
- [ ] `admin` and `super_admin` roles can create, edit, publish, unpublish, and delete surveys
- [ ] SurveyJS drag-and-drop builder works; schema saved as JSON
- [ ] Draft surveys cannot be accessed by customers (public endpoint returns 404)
- [ ] Version history maintained; admin can view any version and roll back
- [ ] Surveys and Leads sidebar items are hidden from non-admin roles (`driver`, etc.)

---

## 6.2 Survey Distribution
- [ ] Admin sends survey from Order Details page (Communication Actions grid)
- [ ] Admin sends survey from Customer Profile (row action)
- [ ] No email field on the send modal — customer is identified by `customerId`
- [ ] Unique `/s/<token>` link is generated per customer+survey send
- [ ] Sending to a customer with an existing pending/in_progress session returns `409` with resend option
- [ ] Customer receives email with the unique survey link

---

## 6.3 Customer Fill Page
- [ ] `/s/<token>` is accessible without login
- [ ] Expired token shows appropriate error screen (not a 500)
- [ ] Already-submitted token shows appropriate error screen
- [ ] Progress auto-saved on each SurveyJS page navigation
- [ ] "Save & Continue Later" button works and shows confirmation
- [ ] Returning to the same URL resumes from the last saved page with saved answers
- [ ] Submission shows the confirmation screen

---

## 6.4 Responses
- [ ] All completed sessions visible in the admin Response view per survey and across all surveys
- [ ] Filter, search, full detail view, and CSV/JSON export work

---

## 6.5 Leads / CRM
- [ ] Lead auto-created atomically on every submission with status `new`
- [ ] Admin can view, filter, change status, assign, and add notes
- [ ] Status changes and note additions recorded in `activityLog`
- [ ] Lead detail drawer shows Notes, Activity, and Response tabs
