import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardEyebrow, CardTitle, CardDescription, CardMeta, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusRow } from '@/components/ui/status-row'
import { Section } from '@/components/ui/section'
import { Divider } from '@/components/ui/divider'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-sm">
      <span className="text-label font-semibold text-theme-text3">{label}</span>
      <div className="flex flex-wrap items-center gap-sm">{children}</div>
    </div>
  )
}

function App() {
  const [switchOn, setSwitchOn] = useState(true)
  const [checked, setChecked] = useState(true)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-xl p-lg">
      <Row label="Button">
        <Button variant="primary">Continue</Button>
        <Button variant="secondary">Change details</Button>
        <Button variant="plain">Not now</Button>
        <Button variant="destructive">Delete account</Button>
        <Button variant="destructive-outline" trailingIcon="signOut">
          Sign out
        </Button>
      </Row>

      <Row label="Card">
        <Card className="max-w-96">
          <CardEyebrow>Waiting for you</CardEyebrow>
          <CardTitle>ABC Bank wants to check your details</CardTitle>
          <CardDescription>To open a cheque account</CardDescription>
          <CardMeta>Asked 4 minutes ago</CardMeta>
          <CardFooter>
            <Button variant="primary" trailingIcon="arrowRight">
              Look at this request
            </Button>
          </CardFooter>
        </Card>
      </Row>

      <Row label="Badge">
        <Badge tone="neutral">Level 1 of 3</Badge>
        <Badge tone="good">Visa approved</Badge>
        <Badge tone="limit">Application refused</Badge>
      </Row>

      <Row label="StatusRow">
        <div className="min-w-80 overflow-hidden rounded-lg border border-theme-border">
          <StatusRow title="Check your grant payment" state="allowed" />
          <StatusRow title="Share your ID with a bank" detail="Because money can be moved with it" state="restricted" />
          <StatusRow title="Change your address" detail="Because it changes your official record" state="restricted" last />
        </div>
      </Row>

      <Section label="Section heading" tone="good">
        <span className="text-bodySm text-theme-text2">Not uppercase — hierarchy comes from size, not case.</span>
      </Section>

      <Row label="Divider">
        <div className="min-w-80">
          <Divider />
        </div>
      </Row>

      <Row label="Avatar">
        <Avatar initials="TK" size="sm" />
        <Avatar initials="TK" size="md" />
        <Avatar initials="TK" size="lg" />
      </Row>

      <Row label="Skeleton">
        <div className="flex min-w-80 flex-col gap-xs">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Row>

      <Row label="EmptyState">
        <EmptyState
          icon="inbox"
          title="No documents yet"
          description="Documents you're issued will show up here."
          action={{ label: 'Learn how to get your first ID', trailingIcon: 'arrowRight' }}
          className="w-full"
        />
      </Row>

      <Row label="Input">
        <Input label="ID number" placeholder="13 digits" className="max-w-80" />
        <Input label="Passport number" error="This field is required" className="max-w-80" />
      </Row>

      <Row label="Switch">
        <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
      </Row>

      <Row label="Checkbox">
        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
      </Row>

      <Row label="RadioGroup">
        <RadioGroup defaultValue="tourism" className="min-w-80">
          <label className="flex items-center gap-sm">
            <RadioGroupItem value="tourism" /> Tourism
          </label>
          <label className="flex items-center gap-sm">
            <RadioGroupItem value="business" /> Business
          </label>
        </RadioGroup>
      </Row>

      <Row label="Sheet">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open menu</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Profile, settings and sign out, from one place.</SheetDescription>
            <SheetClose asChild>
              <Button variant="plain">Close</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </Row>
    </div>
  )
}

export default App
