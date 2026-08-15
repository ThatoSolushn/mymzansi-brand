import * as React from 'react'
import { type FluentIcon } from '@fluentui/react-icons'
import {
  AddRegular,
  ArrowRightRegular,
  CalendarLtrRegular,
  CallRegular,
  CheckmarkCircleRegular,
  CheckmarkRegular,
  ChevronRightRegular,
  ClockRegular,
  CloudOffRegular,
  ContactCardRegular,
  DeleteRegular,
  DismissRegular,
  DocumentRegular,
  EditRegular,
  ErrorCircleRegular,
  EyeRegular,
  FlagRegular,
  GlobeRegular,
  HandWaveRegular,
  HandshakeRegular,
  HistoryRegular,
  HomeRegular,
  InfoRegular,
  LocationRegular,
  LockClosedRegular,
  MailInboxRegular,
  NavigationRegular,
  NewsRegular,
  PaymentRegular,
  PeopleSwapRegular,
  PersonBoardRegular,
  PersonRegular,
  PersonSupportRegular,
  PrintRegular,
  ProhibitedRegular,
  SearchRegular,
  SettingsRegular,
  ShareRegular,
  ShieldRegular,
  SignOutRegular,
  StarRegular,
  TranslateRegular,
  WalletRegular,
  WarningRegular,
} from '@fluentui/react-icons'
import { cn } from '@/lib/utils'

/**
 * Icon — the curated MyMzansi icon set, drawn from Fluent UI System Icons.
 *
 * Components reference an icon by its MyMzansi name (a semantic meaning like
 * `verified`, or an interface glyph like `arrowRight`) — never a raw Fluent
 * component. The map below is the one place the two vocabularies meet, so the
 * whole set can be repointed without touching a screen (BRAND.md §6). The set
 * mirrors the design-system Icons page exactly; both come from the same
 * curated registry.
 *
 * GENERATED from scripts/site/icons.json by scripts (gen_icon_tsx). The Fluent
 * `*Regular` cuts are resizable (1em), so `size` maps straight to fontSize and
 * the glyph inherits the surrounding text colour (currentColor).
 */
export const ICONS = {
  verified: CheckmarkCircleRegular,
  partial: ShieldRegular,
  failed: ErrorCircleRegular,
  restricted: LockClosedRegular,
  consent: HandshakeRegular,
  audit: HistoryRegular,
  revoke: ProhibitedRegular,
  dispute: FlagRegular,
  delegate: PeopleSwapRegular,
  document: DocumentRegular,
  payment: PaymentRegular,
  language: TranslateRegular,
  signLanguage: HandWaveRegular,
  assist: PersonSupportRegular,
  location: LocationRegular,
  offline: CloudOffRegular,
  add: AddRegular,
  alert: WarningRegular,
  arrowRight: ArrowRightRegular,
  calendar: CalendarLtrRegular,
  check: CheckmarkRegular,
  chevronRight: ChevronRightRegular,
  clock: ClockRegular,
  close: DismissRegular,
  delete: DeleteRegular,
  edit: EditRegular,
  eye: EyeRegular,
  globe: GlobeRegular,
  home: HomeRegular,
  idCard: ContactCardRegular,
  inbox: MailInboxRegular,
  info: InfoRegular,
  menu: NavigationRegular,
  news: NewsRegular,
  person_board: PersonBoardRegular,
  phone: CallRegular,
  print: PrintRegular,
  profile: PersonRegular,
  search: SearchRegular,
  settings: SettingsRegular,
  share: ShareRegular,
  shield: ShieldRegular,
  signOut: SignOutRegular,
  star: StarRegular,
  wallet: WalletRegular,
} satisfies Record<string, FluentIcon>

export type IconName = keyof typeof ICONS

export function Icon({
  name,
  size = 20,
  className,
  ...props
}: { name: IconName; size?: number; className?: string } & Omit<React.SVGProps<SVGSVGElement>, 'ref'>) {
  const Glyph = ICONS[name]
  return <Glyph fontSize={size} className={cn('inline-block shrink-0', className)} {...props} />
}
