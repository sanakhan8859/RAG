function CheckEmailDomainIsPersonalOrNotUtil(emailDomain){
    try{

        const PersonalEmailDomainsMap = new Map([
            ['gmail.com', 'Gmail'],
            ['outlook.com', 'Outlook'],
            ['yahoo.com', 'Yahoo'],
            ['protonmail.com', 'ProtonMail'],
            ['icloud.com', 'iCloud'],
            ['zoho.com', 'Zoho'],
            ['aol.com', 'AOL'],
            ['gmx.com', 'GMX'],
            ['mail.com', 'Mail.com'],
            ['yandex.com', 'Yandex'],
            ['fastmail.com', 'FastMail'],
            ['tutanota.com', 'Tutanota'],
            ['hey.com', 'Hey'],
            ['hushmail.com', 'Hushmail'],
            ['lycos.com', 'Lycos'],
            ['inbox.com', 'Inbox'],
            ['mail.ru', 'Mail.ru']
        ]);

        if(PersonalEmailDomainsMap.has(emailDomain)){

            return {
                success : true,
                companyName : PersonalEmailDomainsMap.get(emailDomain)
            }

        }else{

            throw new Error(`${emailDomain} is not present in the PersonalEmailDomainsMap`)

        } 
          

    }catch(err){
        console.log(`Error in CheckEmailDomainIsPersonalOrBusinessUtil with err : ${err}`)
        return {
            success : false
        }
    }
}

module.exports = {
    CheckEmailDomainIsPersonalOrNotUtil
}