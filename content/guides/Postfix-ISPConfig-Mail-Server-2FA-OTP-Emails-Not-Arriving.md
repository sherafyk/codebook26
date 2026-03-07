
# 📧 **Postfix/ISPConfig “Critical Mail” Troubleshooting & Hardening Guide (2025 Edition)**

## **Table of Contents**

1. [Introduction](#introduction)
2. [How Mail Filtering Really Works in ISPConfig](#how-mail-filtering-really-works-in-ispconfig)
3. [Symptoms and Real-World Examples](#symptoms-and-real-world-examples)
4. [Quick Fix: ISPConfig Server Whitelist](#quick-fix-ispconfig-server-whitelist)
5. [Root Causes & Why Whitelisting Sometimes Fails](#root-causes--why-whitelisting-sometimes-fails)
6. [Step-by-Step Troubleshooting Decision Tree](#step-by-step-troubleshooting-decision-tree)
7. [Best Practices for 2FA/OTP Delivery Reliability](#best-practices-for-2faotp-delivery-reliability)
8. [Example: ISPConfig Whitelisting That Actually Works](#example-ispconfig-whitelisting-that-actually-works)
9. [Testing and Verification](#testing-and-verification)
10. [Advanced: When and How to Tune Filters or Disable Temporarily](#advanced-when-and-how-to-tune-filters-or-disable-temporarily)
11. [Appendix: Deeper Dives, Tools, and References](#appendix-deeper-dives-tools-and-references)

---

## 1. Introduction

This guide’s goal:
**Keep critical transactional, 2FA, and OTP emails from providers (OpenAI, Google, banks, Mandrill, etc.) reliably landing in your inbox—every time, no exceptions—on an ISPConfig-managed Postfix server.**

---

## 2. How Mail Filtering Really Works in ISPConfig

* **Postfix** handles SMTP but delegates anti-spam, greylisting, virus scanning, and filtering to background services (Amavis, Rspamd, SpamAssassin, ClamAV, etc.).
* **ISPConfig** manages user/mail domain policies, but filter decisions are often made *outside* of Postfix’s own config, in anti-spam engines, **not** by Postfix itself.
* **Whitelisting in Postfix config** (`main.cf`, header/body checks) is *not* enough if you’re running Amavis, SpamAssassin, or Rspamd via ISPConfig—they may still block mail unless you whitelist via the control panel or directly in the spam filter config.

---

## 3. Symptoms and Real-World Examples

* 2FA/OTP/password reset emails missing or delayed
* Email log shows `milter-reject: END-OF-MESSAGE ... 4.7.1 Try again later`
* Sender uses a third-party (like Mandrill, SendGrid), not their own domain!
* Whitelisting via Postfix or SpamAssassin **has no effect**, but adding the domain in ISPConfig “Server Whitelist” works instantly

---

## 4. Quick Fix: ISPConfig Server Whitelist

**If you do only one thing:**
Go to `ISPConfig > Email > Server Whitelist`, add the *sending domain* **used in the actual email’s Return-Path/Envelope-From**, e.g.,

* `mandrillapp.com` (for emails from OpenAI, many SaaS apps)
* `sendgrid.net`
* `tm.openai.com` (sometimes, but may not be enough—see below)

**Why this works:**
Server-level whitelisting in ISPConfig tells **all mail filters** to always allow mail from those senders for all domains on your server. This bypasses most filter-level rejections, even if SpamAssassin or Amavis is running.

---

## 5. Root Causes & Why Whitelisting Sometimes Fails

**Common reasons 2FA/OTP emails are lost or delayed:**

* The sender’s domain is *not* what you expect. (e.g. OpenAI uses `mandrillapp.com` for transactional mail, not just `tm.openai.com`)
* Postfix’s built-in whitelisting doesn’t override anti-spam milters or greylisting.
* Filtering happens in Amavis/Rspamd/SpamAssassin, which have their own whitelists. **ISPConfig's "Server Whitelist" controls these filters directly.**
* Greylisting can cause one-time delays, but shouldn’t drop mail.
* The “From:” header and the actual sending (Return-Path/Envelope-From) domain can differ.
  **Whitelist the actual sender domain in the mail headers—use the envelope sender in logs!**

---

## 6. Step-by-Step Troubleshooting Decision Tree

### **A. Is it just one sender (e.g., OpenAI)?**

* **Check the mail log** for the “from” address and real sender domain:

  ```bash
  grep -i openai /var/log/mail.log | tail -30
  ```

  Look for lines like:
  `from=<bounces+20216706...@em7877.tm.openai.com>`

  * But check further up for lines like:
    `from=<bounce-md_31165340...@mandrillapp.com>`

* **Whitelist that exact domain** in ISPConfig's Server Whitelist.

---

### **B. Are all 2FA/transactional mails affected?**

* **Repeat the above for each service.**
* Don’t trust the “visible” sender—**find the real Return-Path/Envelope-From domain in the logs or in the raw message source.**

---

### **C. Did adding to ISPConfig Server Whitelist fix it?**

* **Yes:** Done!
* **No:**

  * Check if your filter (Amavis, Rspamd, SpamAssassin) has its *own* whitelists and add the domain there.
  * Check greylisting settings and add domain as exception if delays persist.

---

### **D. If whitelisting doesn’t fix it:**

* Is your milter/anti-spam service running? (`systemctl status amavis rspamd spamassassin`)
* Are you low on RAM/CPU? (`free -h`)
* Is DNS slow? (`dig openai.com`)
* Check `/etc/postfix/main.cf` for unused milters or disabled filters.

---

### **E. For Greylisting Delays**

* **Add domain to greylist whitelist** in ISPConfig or `/etc/postgrey/whitelist_clients`.

---

## 7. Best Practices for 2FA/OTP Delivery Reliability

* **Whitelist the Envelope-From domain** via ISPConfig’s Server Whitelist

  * Not just the visible “From:” address!
* **Add all third-party senders used by your services** (mandrillapp.com, sendgrid.net, amazonses.com, etc.)
* **Whitelist in Amavis/SpamAssassin/Rspamd if you run advanced filter setups**
* **Keep mail filters up and running at all times** (set up Monit, email alerts, etc.)
* **Check the mail log for each new service you use**—verify the actual sender domain.
* **Test with real transactional emails, not just test mails.**

---

## 8. Example: ISPConfig Whitelisting That Actually Works

### **A. Where to add (ISPConfig 3.x):**

1. **Login to ISPConfig Panel**
2. Go to **Email > Server Whitelist**
3. **Add a new entry:**

   * Domain: `mandrillapp.com`
   * (Repeat for any other third-party domains as found in logs)
4. Save and apply changes

**What this does:**
Mail from these domains will *always* be accepted, regardless of filter/greylisting.

---

### **B. Finding the Correct Domain to Whitelist**

Check the “Return-Path” or log lines:

* Example log entry:

  ```
  from=<bounce-md_31165340.683fcd82...@mandrillapp.com>
  ```
* Whitelist: `mandrillapp.com`

---

## 9. Testing and Verification

1. **Send a real OTP/2FA/test email from the service**
2. **Check your inbox**
3. If missing or delayed, **check `/var/log/mail.log`** and look for:

   * Temporary rejections (4xx errors)
   * Repeated attempts before success (greylisting symptom)
   * “milter-reject” or “spam” related soft bounces
4. If mail arrives immediately after whitelisting—**success!**
5. **If not:** Re-check the actual sender domain and whitelist that.

---

## 10. Advanced: When and How to Tune Filters or Disable Temporarily

* If you need to *diagnose* whether a milter is the culprit, **comment out `smtpd_milters` and `non_smtpd_milters` in main.cf** and restart postfix.
* If this makes OTPs work, your filter is misconfigured or over-aggressive.
* **You can also add “trusted” entries directly to Amavis or Rspamd/SpamAssassin configs**—but in most ISPConfig setups, server whitelist is the effective solution.

---

## 11. Appendix: Deeper Dives, Tools, and References

* [ISPConfig Docs: Server Whitelist](https://www.ispconfig.org/documentation/)
* [Postfix Milter](http://www.postfix.org/MILTER_README.html)
* [Rspamd Whitelisting](https://rspamd.com/doc/modules/multimap.html)
* [Mail log analysis](https://www.cyberciti.biz/tips/postfix-log-files.html)
* [Testing with Swaks](https://github.com/jetmore/swaks):

  ```bash
  swaks --to your@email --from test@trusted.com --server your.mail.server
  ```
* [MXToolbox Blacklist Check](https://mxtoolbox.com/blacklists.aspx)

---

## **Summary Checklist: For Every New Service**

* [ ] Check the real sender domain in `/var/log/mail.log`
* [ ] Add that domain to ISPConfig Server Whitelist
* [ ] Test with a real email
* [ ] If still blocked/delayed, check filters and greylisting for that domain
* [ ] Monitor mail logs to verify delivery

