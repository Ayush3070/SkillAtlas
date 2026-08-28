#!/usr/bin/env python3
"""
Smart fixer: detect broken lucide-react imports where multiple identifiers got
concatenated without commas and split them safely.
"""
import re, os, glob

# Identifiers we know exist in lucide-react 1.x
KNOWN = set("""
Activity Airplay AlertCircle AlertOctagon AlertTriangle AlignCenter AlignJustify AlignLeft AlignRight
Anchor Aperture Archive ArrowBigDown ArrowBigLeft ArrowBigRight ArrowBigUp ArrowDown ArrowDown01
ArrowDown10 ArrowDownAZ ArrowDownCircle ArrowDownFromLine ArrowDownLeft ArrowDownNarrowWide
ArrowDownRight ArrowDownToDot ArrowDownToLine ArrowDownUp ArrowDownWideNarrow ArrowDownZ ArrowLeft
ArrowLeftCircle ArrowLeftFromLine ArrowLeftRight ArrowLeftToLine ArrowRight ArrowRightCircle
ArrowRightFromLine ArrowRightLeft ArrowRightToLine ArrowRightToSquare ArrowRotaryFirstLeft
ArrowRotaryFirstRight ArrowRotaryLastLeft ArrowRotaryLastRight ArrowRotaryLeft ArrowRotaryRight
ArrowSmallDown ArrowSmallLeft ArrowSmallRight ArrowSmallUp ArrowSquareLeft ArrowSquareRight
ArrowUp ArrowUp01 ArrowUp10 ArrowUpAZ ArrowUpCircle ArrowUpDown ArrowUpFromDot ArrowUpFromLine
ArrowUpLeft ArrowUpNarrowWide ArrowUpRight ArrowUpRightFromSquare ArrowUpRightSquare ArrowUpSquare
ArrowUpToLine ArrowUpWideNarrow ArrowUpZ Asterisk AtSign AudioLines AudioWaveform Award Axe BadgeAlert
BadgeCheck BadgeDollarSign BadgeHelp BadgeInfo BadgeMinus BadgePercent BadgePlus BadgeX BaggageClaim
Ban Banknote BarChart BarChart2 BarChart3 BarChart4 BarChartBig BarChartHorizontal BarChartVertical
Baseline Battery BatteryCharging BatteryFull BatteryLow BatteryMedium BatteryWarning Beaker Bean
Bed Bell BellDot BellElectric BellMinus BellOff BellPlus BellRing BetweenHorizontalEnd
BetweenHorizontalStart BetweenVerticalEnd BetweenVerticalStart Bike Bio Binary BirdBirthdayCake
Bitcoin Blend Bluetooth Bold Bomb Book BookA BookAudio BookCheck BookCopy BookDashed BookDown
BookHeadphones BookHeart BookImage BookKey BookLock BookMarked BookMinus BookOpen BookOpenCheck
BookOpenText BookPlus BookText BookType BookUp BookUp2 BookUser BookX Bookmark BookmarkCheck
BookmarkMinus BookmarkPlus BookmarkX Box Boxes Briefcase Brush Bug Building Building2 Bus BusFront
Cable CableCar Cake CakeSlice Calculator Calendar CalendarCheck CalendarCheck2 CalendarClock
CalendarCog CalendarDays CalendarFold CalendarHeart CalendarMinus CalendarOff CalendarPlus
CalendarRange CalendarSearch CalendarSync CalendarX Camera CameraOff Candlestick ChartCandlestick
ChartColumn ChartColumnBig ChartGantt ChartLine ChartLineIncreasing ChartNetwork ChartNoAxesColumn
ChartNoAxesColumnDecreasing ChartNoAxesColumnIncreasing ChartNoAxesCombined ChartNoAxesRow ChartPie
ChartScatter ChartSpline ChartSplineIncreasing Check CheckCheck ChefHat Cherry CherryIcon
ChevronDown ChevronDownCircle ChevronDownSquare ChevronFirst ChevronLast ChevronLeft
ChevronLeftCircle ChevronLeftSquare ChevronRight ChevronRightCircle ChevronRightSquare
ChevronUp ChevronUpCircle ChevronUpSquare ChevronsDown ChevronsDownUp ChevronsLeft ChevronsLeftRight
ChevronsRight ChevronsRightLeft ChevronsUp ChevronsUpDown Chrome CircuitBoard Citrus Clapperboard
Clipboard ClipboardCheck ClipboardCopy ClipboardEdit ClipboardList ClipboardMinus ClipboardPaste
ClipboardPen ClipboardPenLine ClipboardPlus ClipboardSignature ClipboardType ClipboardX Clock
Clock1 Clock10 Clock11 Clock12 Clock2 Clock3 Clock4 Clock5 Clock6 Clock7 Clock8 Clock9 ClockAlert
ClockArrowDown ClockArrowUp ClockCheck ClockIcon ClockPlus Cloud CloudCog CloudDownload CloudFog
CloudHail CloudLightning CloudMoon CloudMoonRain CloudOff CloudRain CloudRainWind CloudSnow
CloudSun CloudSunRain CloudUpload Cloudy Clover Code Code2 Codepen Codesandbox Coffee Cog
Coins Columns2 Columns3 Columns4 Combine Command Compass Component ConciergeBell Cone Construction
Container Copy CopyCheck CopyMinus CopyPlus CopySlash CopyX CornerDownLeft CornerDownRight
CornerLeftDown CornerLeftUp CornerRightDown CornerRightUp Cpu CreativeCommons CreditCard
Croissant Crop Cross Crosshair Crown Cuboid Currency CupSoda CurlyBraces CurrencyBitcoin Currency
Cylinder Database DatabaseBackup DatabaseZap Decimals Delete Dessert Diamond DiamondIcon Dice1 Dice2
Dice3 Dice4 Dice5 Dice6 Dices Diff Disc Disc2 Disc3 DiscAlbum Divide Dna DnaOff Dog DollarSign
Donut DoorClosed DoorOpen Dot DotIcon Download DownDown DragDropDrawingPointer Dribbble Drill Drum
Drone Droplet DropletOff Droplets Drumstick DrumstickIcon Dumbbell Ear EarOff Earth Eclipse
EclipseIcon Edit Edit2 Edit3 Egg EggFried EggIcon EggOff Ellipsis EllipsisVertical Equal EqualNot
Eraser Ethernet Euro Icon EvChargingStation EvPlug EvPlugType EvStation EvStations EvIcon Exit Expand
ExternalLink Eye EyeOff Facebook Factory Fan FastForward Feather Fence FerrisWheel Figma File
FileArchive FileAudio FileAxis3d FileBadge FileBarChart FileBarChart2 FileBox FileCheck
FileCheck2 FileClock FileCode FileCode2 FileCog FileCog2 FileDiff FileDigit FileDown FileEdit
FileHeart FileImage FileInput FileJson FileJson2 FileKey FileKey2 FileLineChart FileLock
FileLock2 FileMinus FileMusic FileOutput FilePen FilePenLine FilePieChart FilePlus FileQuestion
FileScan FileSearch FileSearch2 FileSignal FileSliders FileSpreadsheet FileStack FileSymlink
FileTerminal FileText FileType FileType2 FileUp FileUser FileVideo FileVolume FileVolume2
FileWarning FileX FileX2 Files Film Filter FilterX Fingerprint Fire FireExtinguisher Fish
FishOff FishingFlag Flag FlagOff FlagTriangleLeft FlagTriangleRight Flame FlameKindling
FlashlightOff FlashlightOn Flask FlaskConical FlaskRound FlipHorizontal FlipHorizontal2
FlipVertical FlipVertical2 Flower Flower2 FlowerIcon Focus FocusSquare FoldHorizontal
FoldVertical Folder FolderArchive FolderCheck FolderClock FolderClosed FolderCog FolderDot
FolderDown FolderEdit FolderGit FolderGit2 FolderHeart FolderHeartIcon FolderInput FolderKanban
FolderKey FolderLock FolderMinus FolderOpen FolderOpenDot FolderPlus FolderSearch FolderSearch2
FolderSync FolderTree FolderUp FolderX Folders Forward Frame Framer Fridge FridgeIcon Frog
Fullscreen Fullscreen2 Funnel GalleryHorizontal GalleryHorizontalEnd GalleryVertical
GalleryVerticalEnd Gamepad Gamepad2 Gauge Gavel Gem Ghost Gift GitBranch GitBranchPlus GitCommit
GitCommitHorizontal GitCommitVertical GitCompare GitCompareArrows GitFork GitGraph GitHub
GitHubIcon Gitlab GitMerge GitMergeConflict GitMergeQueue GitPullRequest GitPullRequestArrow
GitPullRequestClosed GitPullRequestCreate GitPullRequestCreateArrow GitPullRequestDraft
GitPullRequestPending GitStar Globe Globe2 GlobeLock Goal GraduationCap Grape Grid2x2 Grid2x2Check
Grid2x2Plus Grid2x2X Grid3x3 Grid3x3Icon GridGripHorizontal GridGripVertical GridPlus
Grip GripHorizontal GripVertical Group Guitar Hammer Hamster Hand HandCoins HandHeart HandHelping
HandMetal HandPlatter Handshake HardDrive HardDriveDownload HardDriveUpload Hash HatIcon Haze
HdmiIcon Heading Heading1 Heading2 Heading3 Heading4 Heading5 Heading6 HeadphoneAudio Headphones
HeadphonesIcon Headset Heart HeartCrack HeartHandshake HeartHandshakeIcon HeartIcon HeartOff
HeartPulse Heater Hexagon Highlighter History Home Hop HopOff Hourglass House HousePlug
HousePlus HouseWifi IceCream IceCreamCone Icon Image ImageDown ImageIcon ImageMinus ImageOff
ImagePlay ImagePlus ImageUp Images Import Inbox InboxIcon IndentDecrease IndentIncrease
IndianRupee Infinity Info InboxInspection Panel InfoIcon InboxIcon Input InsertChartInserted
Inspect Instagram Italic IterationCcw IterationCcwIcon IterationCcwSquare IterationCw
IterationCwIcon IterationCwSquare JapaneseYen Joystick JoystickIcon JumpUp Kanban Key
KeyRound KeySquare Keyboard KeyboardIcon KeyboardMusic KeyboardOff KeyIcon Lamp LampCeiling
LampDesk LampDim LampFloor LampIcon LampWallAbove LampWallDown LandPlot Landmark Languages
Laptop Laptop2 Lasso Laugh Layers Layers2 Layers3 Layout LayoutDashboard LayoutGrid LayoutList
LayoutPanelLeft LayoutPanelTop LayoutTemplate Leaf LeafIcon LeafyGreen Lectern Library
LibraryBig LibraryIcon LifeBuoy Ligature Lightbulb LightbulbOff Link Link2 Linkedin List
ListChecks ListCollapse ListEnd ListFilter ListIndent ListIndentDecrease ListIndentIncrease
ListMusic ListOrdered ListPlus ListRestart ListStart ListTodo ListTree ListVideo ListX
Loader Loader2 LoaderCircle Locate LocateFixed Lock LockKeyhole LockOpen LogIn LogOut Logs
Lollipop Luggage Magnet MagnetIcon Mail MailCheck MailCheckIcon MailIcon MailMinus MailOpen
MailOpenIcon MailPlus MailQuestion MailSearch MailWarning MailX Mails Mailbox MailboxIcon
Map MapIcon MapMinus MapPin MapPinCheck MapPinCheckInside MapPinIcon MapPinMinus MapPinOff
MapPinPlus MapPinX MapPinned MapPlus Mars MarsStroke Martini MartiniIcon Maximize Maximize2
Medal Megaphone MegaphoneOff Meh MemoryMerge Menu MenuIcon MenuSquare Merge MessageCircle
MessageCircleDashed MessageCircleHeart MessageCircleMore MessageCircleOff MessageCirclePlus
MessageCircleQuestion MessageCircleReply MessageCircleWarning MessageCircleX MessageSquare
MessageSquareDashed MessageSquareDiff MessageSquareDot MessageSquareHeart MessageSquareLock
MessageSquareMore MessageSquareOff MessageSquarePlus MessageSquareQuote MessageSquareReply
MessageSquareShare MessageSquareText MessageSquareWarning MessageSquareX MessagesSquare
MessagesSquareIcon Mic Mic2 MicOff MicVocal Microchip Microscope Microwave MicrowaveIcon
Milestone MilestoneIcon Milk Minimize Minimize2 MinimizeIcon Minus Monitor MonitorCheck
MonitorCog MonitorDown MonitorOff MonitorPause MonitorPlay MonitorSmartphone MonitorSpeaker
MonitorStop MonitorUp MonitorX Monkey Moon MoreHorizontal MoreVertical Mountain MountainIcon
MountainSnow Mouse MouseIcon MouseOff MousePointer MousePointer2 MousePointer2Click
MousePointerClick Move Move3d MoveDiagonal MoveDiagonal2 MoveDown MoveDownLeft MoveDownRight
MoveHorizontal MoveLeft MoveRight MoveUp MoveUpLeft MoveUpRight MoveVertical Music
Music2 Music3 Music4 Navigation Navigation2 Network NetworkIcon Newspaper NewspaperIcon
NfcIcon Nonce NotepadText NoteIcon Notification Action Icon Npm Octagon Omega Option
Orbit Origami Package Package2 PackageCheck PackageCheckIcon PackageIcon PackageMinus
PackageOpen PackagePlus PackagePlusIcon PackageSearch PackageSearchIcon PackageX PackageXIcon
PaintBucket PaintRoller PaintRollerIcon Paintbrush Palette Palmtree PalmtreeIcon PanelBottom
PanelBottomClose PanelBottomInactive PanelBottomOpen PanelLeft PanelLeftClose PanelLeftInactive
PanelLeftOpen PanelRight PanelRightClose PanelRightInactive PanelRightOpen PanelTop
PanelTopBottomInactive PanelTopClose PanelTopInactive PanelTopOpen PanelsLeftBottom
PanelsRightBottom PanoramicRotate Paperclip Parentheses ParenthesesIcon ParkingCircle
ParkingCircleOff ParkingSquare ParkingSquareOff PartyPopper Pause PcCase PcCaseIcon
Pen PenBox PenBoxIcon PenIcon PenLine PenSquare PenTool Pentagon Percent PersonStanding
PerspectiveMat PhilippinePeso Phone PhoneCall PhoneCallIcon PhoneForwarded PhoneIncoming
PhoneIcon PhoneMissed PhoneOff PhoneOutgoing PhoneRing PhoneVibrate PhoneVolume PhoneX
Pi Piano PictureInPicture PictureInPicture2 PieChart PiggyBank Pilcrow PilcrowIcon Pill
PillBottle Pin PinIcon PinOff Pipette Pizza Plane PlaneIcon PlaneLanding PlaneTakeoff
Play PlayCircle PlaySquare Plug Pocket PocketIcon Podcast Pointer PointerOff Popcorn Popsicle
Power PowerOff Presentation Printer PrinterCheck Projector Puzzle Pyramid QrCode Quote
Rabbit RabbitIcon Radar Radiation Radio RadioReceiver RadioTower Radius Rat RectangleHorizontal
RectangleVertical Recycle Redo Redo2 RedoDot RefreshCcw RefreshCcwDot RefreshCw RefreshCwOff
Refrigerator Regex RemoveFormatting Repeat Repeat1 Repeat2 Replace ReplaceAll Reply ReplyAll
Rewind Ribbon RibbonIcon Rocket RocketIcon RockingChair RollerCoaster Rotate3d RotateCcw
RotateCcwKey RotateCcwSquare RotateCw RotateCwSquare RotateSquare Route Router RouterIcon Rows
Rows2 Rows3 Rows4 Rss Ruler RulerIcon RussianRuble Sailboat Salad Sandwich Satellite
SatelliteDish Save SaveAll Scale Scaling Scalpel Scan ScanBarcode ScanEye ScanFace ScanLine
Scissors ScissorsIcon ScissorsLineDashed School School2 SchoolIcon Scissors Square Mouse
ScreenShare ScreenShareOff Scroll ScrollText Search SearchCheck SearchCheckIcon SearchCode
SearchIcon SearchLargeIcon SearchSlash SearchX SearchXIcon Section Send SendHorizonal
SendHorizontal SeparatorHorizontal SeparatorVertical Server Settings Settings2 Share
Share2 Sheet Shell Ship ShipIcon ShipWheel Shirt ShoppingBag ShoppingBagIcon ShoppingBasket
ShoppingCart ShowerHead Shrimp Shrink ShrinkIcon Shrub Shuffle Sigma Signal SignalHigh
SignalIcon SignalLow SignalMedium SignalZero Siren SkipBack SkipForward Skull SkullIcon
Slack Slash Sliders SlidersHorizontal SlidersIcon Smartphone SmartphoneCharging
SmartphoneIcon Smile SmilePlus SmileIcon Snail Snake Snowflake Soap Socket Sofa SolarPanel
SolarPanelIcon Sort SortAsc SortDesc Soup SoulIcon Space Sparkles Spade SpadeIcon Sparkle
Spatula Speaker Icon Speech Square SquareActivity SquareArrowDown SquareArrowDownLeft
SquareArrowDownRight SquareArrowLeft SquareArrowOutDownLeft SquareArrowOutDownRight
SquareArrowOutUpLeft SquareArrowOutUpRight SquareArrowRight SquareArrowUp SquareArrowUpLeft
SquareArrowUpRight SquareAsterisk SquareBottomDashedScissors SquareChartGantt SquareCheck
SquareCheckBig SquareCheckCircle SquareChevronDown SquareChevronLeft SquareChevronRight
SquareChevronUp SquareCode SquareDashed SquareDashedBottom SquareDashedBottomCode
SquareDashedKanban SquareDashedMousePointer SquareDashedTopSolid SquareDashedTopSolidPlus
SquareDashedTopTop Dashed SquareDashedKanbanIcon Dashed Kanban SquareDashedMousePointer
SquareDivide SquareDot SquareEqual SquareFunction SquareGantt SquareGanttIcon
SquareKanban SquareKanbanIcon SquareLibrary SquareM SquareMenu SquareMIcon
SquareMousePointer SquareParking SquareParkingIcon SquarePause SquarePen SquarePenLine
SquarePercent SquarePi SquarePilcrow SquarePilcrowIcon SquarePlay SquarePlus
SquarePower SquarePowerIcon SquareRadical SquareRoundCorner SquareScissors SquareSigma
SquareSlash SquareSplitHorizontal SquareSplitVertical SquareStack SquareStar SquareStop
SquareSubtract SquareTerminal SquareTruckIcon SquareUser SquareUserIcon SquareUserRound
SquareUserRoundIcon SquareUsers SquareUsersIcon SquareX SquareXIcon Squircle Squirrel
Stamp Star StarHalf StarOff StarIcon StarOffIcon Stars StepBack StepForward Stethoscope
Sticker StickyNote Stop Store StoreIcon StretchHorizontal StretchVertical Strikethrough
Subscript SubscriptIcon Subtitles Sun SunDim SunIcon SunMedium SunMoon SunSnow Sunrise
Sunset Superscript SuperscriptIcon Swords SwordsIcon SwordsLine Sword Icon Syringe Table
Table2 TableCells TableCellsMerge TableCellsSplit TableColumns TableConfig TableGrid
TableGridIcon TableIcon TableOfContents TableProperties TableRows TableRowsSplit
Tablet TabletIcon TabletSmartphone Tag TagIcon Tags TagsIcon Tally1 Tally2 Tally3 Tally4
Tally5 Tangent Target Tent TentIcon Terminal TerminalIcon TestTube TestTubes Text TextAlignCenter
TextAlignCenterIcon TextAlignEnd TextAlignEndIcon TextAlignJustify TextAlignJustifyIcon
TextAlignLeft TextAlignLeftIcon TextAlignRight TextAlignRightIcon TextCursor TextCursorInput
TextQuote TextSearch TextSearchIcon TextSelect TextSelection TextWrap Theatermask Thermometer
ThermometerIcon ThermometerSnowflake ThermometerSun ThumbsDown ThumbsUp Ticket TicketCheck
TicketCheckIcon TicketIcon TicketMinus TicketPercent TicketPlus TicketSlash TicketX Timer
TimerCog TimerIcon TimerOff TimerReset ToggleLeft ToggleRight Toilet Torch Tornade
Torus Touchpad TouchpadIcon Tower TowerControl ToyBrick Tractor TrafficCone Train TrainFront
TrainFrontTunnel Tram Transcribe TranscribeIcon Trash Trash2 Tree TreeDeciduous TreeDeciduousIcon
TreePalm TreePine TreePineIcon Trees TrendHorizontal TrendingDown TrendingDownIcon
TrendingUp TrendingUpDown TrendingUpIcon Triangle TriangleAlert TriangleDashed TriangleIcon
TriangleRight Trophy Truck TruckElectric TruckIcon Turtle Tv Tv2 TvIcon Twitch Twitter Type
Umbrella UmbrellaIcon Undo Undo2 UndoDot UnfoldHorizontal UnfoldVertical Ungroup University
Unlink Unlink2 Unlock UnlockKeyhole Unplug Unsubscribe Upload UpDown UpUp UsbIcon User
User2 UserCheck UserCheckIcon UserCircle UserCircle2 UserCog UserCog2 UserCrown UserCrownIcon
UserDown UserGear UserGearIcon UserHeart UserHeartIcon UserIcon UserLock UserLockIcon
UserMinus UserMinusIcon UserPen UserPenIcon UserPlus UserPlusIcon UserRound UserRoundCheck
UserRoundCheckIcon UserRoundCog UserRoundCogIcon UserRoundDown UserRoundIcon
UserRoundMinus UserRoundMinusIcon UserRoundPen UserRoundPenIcon UserRoundPlus UserRoundPlusIcon
UserRoundSearch UserRoundSearchIcon UserRoundX UserRoundXIcon UserSearch UserSearchIcon
UserSettings UserSettingsIcon UserShield UserShieldCheck UserShieldCheckIcon UserShieldIcon
UserSquare UserSquare2 UserStar UserStarIcon UserTag UserTagIcon UserUp UserX UserXIcon
Users Users2 UsersIcon UsersRound UsersRoundIcon Utensils UtensilsCrossed UtensilsIcon
UtilityPole Variable Vault Vector VenetianMask Venus VaultIcon Verified Vibrate VibrateOff
Video VideoOff Videotape View ViewIcon Voicemail Volleyball Wallet Wallpaper Wand WandSparkles
Warehouse Watch Waves Webcam WebcamIcon Webhook WebhookOff Weight WeightIcon Wheat WheatOff
WholeWord Wifi WifiHigh WifiIcon WifiLow WifiOff WifiPen WifiZero Wind WindArrowDown
Wine WineOff Workflow WorkflowIcon WrapText Wrench WrenchIcon X XCircle XCircleIcon
XICon XOctagon XSquare XI Square Yammer Youtube Zap ZapOff ZodIcon ZoomIn ZoomInIcon
ZoomOut ZoomOutIcon
""".split())

# Add common aliases
KNOWN.update({"X": "X"})

os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")

fixed = 0
for path in glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True):
    with open(path) as fp:
        text = fp.read()
    new = text
    # Find lucide-react imports and within them, split concatenated PascalCase identifiers
    def split_imports(match):
        head, body, tail = match.group(1), match.group(2), match.group(3)
        # Split body by commas and whitespace
        parts = re.split(r"[,\s]+", body)
        parts = [p for p in parts if p]
        # If a single part is a concatenation of known PascalCase names, split greedily
        out = []
        for p in parts:
            if "," in p or p in KNOWN or p == "":
                out.append(p)
                continue
            # Greedy split: find longest prefix that is a known icon
            i = 0
            rest = p
            while rest:
                match_len = None
                # Try longest first
                for L in range(min(len(rest), 30), 0, -1):
                    cand = rest[:L]
                    if cand in KNOWN:
                        match_len = L
                        break
                if match_len is None:
                    # unknown — keep as-is
                    out.append(rest)
                    break
                out.append(rest[:match_len])
                rest = rest[match_len:]
        # Re-emit
        return head + ", ".join(out) + tail
    new2 = re.sub(
        r'(import\s*\{)([^}]*)(\}\s*from\s*["\']lucide-react["\']\s*;?)',
        split_imports, new,
    )
    if new2 != new:
        with open(path, "w") as fp:
            fp.write(new2)
        fixed += 1
        print("fixed:", path)

print(f"Done. {fixed} file(s) updated.")
