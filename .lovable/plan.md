
## Change the sender address to the verified lizaos.ai domain

### What changes

**`supabase/functions/notify-signup/index.ts`** — line 35 only:

Current:
```
from: 'LIZA OS <onboarding@resend.dev>',
```

New:
```
from: 'LIZA OS <invite@invite.lizaos.ai>',
```

That is the only edit. No other files touched. The function redeploys automatically.

### Why this is safe
- `invite.lizaos.ai` is already verified in Resend, so the email will pass SPF/DKIM and land in the inbox rather than spam.
- The `to` recipients and all other logic remain unchanged.
