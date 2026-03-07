## CODING PROJECT CONTEXT TEMPLATE
This template ensures the LLM has comprehensive context and prompts it to ask follow-up questions rather than making assumptions.  
  
## Begin prompt

> [!TIP]
> - Fill in all relevant sections before your specific coding request
> - If some sections are too specific or out of scope, you can omit
> - Be as specific as possible with paths, versions, and configurations  
> - Include any unique aspects of your setup that differ from standard installations
> - The final request explicitly asks the LLM to probe for missing context
> - Adapt sections based on your project type (web app, API, desktop app, etc.)
> - **Edit each field inline (yes you can type directly if viewing on ['codebook.sherafy.com'](https://codebook.sherafy.com/) and not github)**
> - Copy and paste to your LLM. Your answers will be in line, with labels and answers together
> - For multiline answers, just type and use Shift+Enter for line breaks if needed
> - Don't refresh this page if typing in values or you will be sad.

### Copy below this line, edit, and pass to LLM.
You can edit the fields with custom values. Triple click each cell to replace the text with your own.

---

#### **System Environment & Infrastructure**

  <div class="section">
    <div class="field"><b>Operating System:</b> <span contenteditable="true">e.g., Debian 12, Ubuntu 22.04, Windows 11</span></div>
    <div class="field"><b>Web Server:</b> <span contenteditable="true">e.g., Apache 2.4, Nginx 1.18, IIS</span></div>
    <div class="field"><b>Control Panel:</b> <span contenteditable="true">e.g., ISPConfig, cPanel, Plesk, or none</span></div>
    <div class="field"><b>Domain/URL:</b> <span contenteditable="true">your-domain.com</span></div>
    <div class="field"><b>Document/Web Root:</b> <span contenteditable="true">e.g., /var/www/clients/client0/web1/web/</span></div>
    <div class="field"><b>Project Root:</b> <span contenteditable="true">e.g., /var/www/clients/client0/web1/project/</span></div>
    <div class="field"><b>Database:</b> <span contenteditable="true">MySQL 8.0, PostgreSQL 14, SQLite, etc.</span></div>
    <div class="field"><b>Runtime Environment:</b> <span contenteditable="true">Node.js v18, Python 3.11, PHP 8.2, etc.</span></div>
  </div>

#### **Current Project Architecture**

  <div class="section">
    <div class="field"><b>Framework/CMS:</b> <span contenteditable="true">e.g., Strapi, WordPress, Laravel, Express.js</span></div>
    <div class="field"><b>Frontend Technology:</b> <span contenteditable="true">React, Vue, vanilla JS, static HTML</span></div>
    <div class="field"><b>Backend Location:</b> <span contenteditable="true">Full path if separate from web root</span></div>
    <div class="field"><b>API Endpoints:</b> <span contenteditable="true" class="multiline">Existing API structure/routes</span></div>
    <div class="field"><b>Build Tools:</b> <span contenteditable="true">webpack, Vite, npm scripts, etc.</span></div>
    <div class="field"><b>Process Management:</b> <span contenteditable="true">PM2, systemd, supervisor, etc.</span></div>
  </div>

#### **Network & Security Configuration**

  <div class="section">
    <div class="field"><b>SSL/HTTPS Status:</b> <span contenteditable="true">configured/not configured</span></div>
    <div class="field"><b>Proxy Configuration:</b> <span contenteditable="true" class="multiline">Existing Apache/Nginx proxy rules</span></div>
    <div class="field"><b>Firewall/Ports:</b> <span contenteditable="true" class="multiline">Relevant open ports and restrictions</span></div>
    <div class="field"><b>Authentication:</b> <span contenteditable="true">JWT, sessions, OAuth, etc.</span></div>
  </div>

#### **Current State & Working Components**

  <div class="section">
    <div class="field"><b>What's Currently Working:</b> <span contenteditable="true" class="multiline big">List functional features</span></div>
    <div class="field"><b>What's in Web Directory:</b> <span contenteditable="true" class="multiline big">Current contents of document root</span></div>
    <div class="field"><b>Existing Configuration Files:</b> <span contenteditable="true" class="multiline big">Relevant config files and their locations</span></div>
    <div class="field"><b>Dependencies Installed:</b> <span contenteditable="true" class="multiline big">Key packages, versions</span></div>
    <div class="field"><b>Permission Structure:</b> <span contenteditable="true" class="multiline big">User/group ownership, any permission constraints</span></div>
  </div>

#### **Project Goals & Requirements**

  <div class="section">
    <div class="field"><b>Primary Objective:</b> <span contenteditable="true" class="multiline big">What you're trying to accomplish</span></div>
    <div class="field"><b>Specific Features Needed:</b> <span contenteditable="true" class="multiline big">Detailed feature requirements</span></div>
    <div class="field"><b>URL Structure Plan:</b> <span contenteditable="true" class="multiline">How you want routes organized</span></div>
    <div class="field"><b>Performance Requirements:</b> <span contenteditable="true" class="multiline">Any speed/optimization needs</span></div>
    <div class="field"><b>Integration Points:</b> <span contenteditable="true" class="multiline">APIs, third-party services, etc.</span></div>
  </div>

#### **Known Constraints & Preferences**
  <div class="section">
    <div class="field"><b>ISP/Hosting Limitations:</b> <span contenteditable="true" class="multiline">Shared hosting restrictions, etc.</span></div>
    <div class="field"><b>Technology Preferences:</b> <span contenteditable="true" class="multiline">Preferred libraries, patterns, etc.</span></div>
    <div class="field"><b>Compatibility Requirements:</b> <span contenteditable="true" class="multiline">Browser support, mobile, etc.</span></div>
    <div class="field"><b>Deployment Constraints:</b> <span contenteditable="true" class="multiline">CI/CD, manual deployment, etc.</span></div>
  </div>

#### **Development Context**

  <div class="section">
    <div class="field"><b>Development Stage:</b> <span contenteditable="true">Initial setup, mid-development, production ready</span></div>
    <div class="field"><b>Team Size:</b> <span contenteditable="true">Solo, small team, etc.</span></div>
    <div class="field"><b>Maintenance Requirements:</b> <span contenteditable="true" class="multiline">Long-term maintainability needs</span></div>
    <div class="field"><b>Documentation Needs:</b> <span contenteditable="true" class="multiline">Level of commenting/docs required</span></div>
  </div>
  
---

#### REQUEST:

  <div class="section">
    <div class="field"><b>Based on this context, I need help with:</b> <span contenteditable="true">Describe your specific coding task or question here</span></div>
  </div>
<br>
  <div class="section">
    To ensure the code works flawlessly on first implementation, please ask me any clarifying questions about missing details, assumptions, or specifics about my setup that could affect the solution. I want to avoid generic examples and ensure the code accounts for my exact environment and constraints.
  </div>




