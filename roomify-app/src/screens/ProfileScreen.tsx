import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  GestureResponderEvent,
} from "react-native";

/* ---------- THEME (ported from your CSS variables) ---------- */
const theme = {
  background: "#2C2C2C",
  foreground: "#ffffff",
  card: "#E8DECF",
  cardForeground: "#000000",
  secondary: "#C97B63",
  secondaryForeground: "#ffffff",
  muted: "#d4caba",
  mutedForeground: "#6b6b6b",
  accent: "#C97B63",
  accentForeground: "#ffffff",
  border: "rgba(0,0,0,0.1)",
};

const W = Dimensions.get("window").width;
const MAX_FRAME_W = 390;

/* ---------- tiny animated helpers ---------- */
function usePressScale(initial = 1, to = 0.96) {
  const val = useRef(new Animated.Value(initial)).current;
  const onPressIn = () =>
    Animated.spring(val, { toValue: to, useNativeDriver: true, friction: 6 }).start();
  const onPressOut = () =>
    Animated.spring(val, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  return { scaleStyle: { transform: [{ scale: val }] }, onPressIn, onPressOut, val };
}

function FadeSlide({
  show,
  children,
  offset = 12,
  duration = 240,
  delay = 0,
}: {
  show: boolean;
  children: React.ReactNode;
  offset?: number;
  duration?: number;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(show ? 1 : 0)).current;
  const translate = useRef(new Animated.Value(show ? 0 : offset)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: show ? 1 : 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: show ? 0 : offset,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [show, duration, delay, offset, opacity, translate]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: translate }] }}>
      {children}
    </Animated.View>
  );
}

/* Stagger a list of children (AI cards) */
function StaggerIn({ items }: { items: React.ReactNode[] }) {
  return (
    <View>
      {items.map((child, i) => (
        <FadeSlide key={i} show offset={12} duration={260} delay={i * 80}>
          <View style={{ marginBottom: 16 }}>{child}</View>
        </FadeSlide>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<"AI" | "saved" | "liked" | null>(null);
  const frameWidth = useMemo(() => Math.min(W, MAX_FRAME_W), []);

  const toggleTab = (tab: "AI" | "saved" | "liked") =>
    setActiveTab((prev) => (prev === tab ? null : tab));

  const headerIconsLeft = ["magnifying-glass", "moon", "plus"];
  const headerIconsRight = ["grid", "user-plus", "cog-6-tooth"];

  const TAB_DATA = [
    {
      id: "AI" as const,
      label: "AI History",
      icon: "sparkler",
    },
    {
      id: "saved" as const,
      label: "Saved History",
      icon: "home",
    },
    {
      id: "liked" as const,
      label: "Liked History",
      icon: "heart",
    },
  ];

  /* content images (from your JSX) */
  const BG_IMAGE =
    "https://images.unsplash.com/photo-1628592102751-ba83b0314276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
  const PROFILE =
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&h=600&fit=crop";
  const before1 =
    "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?w=600&h=400&fit=crop";
  const after1 =
    "https://images.unsplash.com/photo-1680210850481-66ee30ca2a48?w=600&h=400&fit=crop";
  const before2 =
    "https://images.unsplash.com/photo-1641823911769-c55f23c25143?w=600&h=400&fit=crop";
  const after2 =
    "https://images.unsplash.com/photo-1650091722991-fde645dd72a6?w=600&h=400&fit=crop";
  const before3 =
    "https://images.unsplash.com/photo-1733426107854-ee00a25d72a7?w=600&h=400&fit=crop";
  const after3 =
    "https://images.unsplash.com/photo-1747336754870-ca7b10cc75f5?w=600&h=400&fit=crop";

  const AI_CARDS = [
    { badge: "Minimalist", date: "Sep 28, 2025", before: before1, after: after1 },
    { badge: "Scandinavian", date: "Sep 25, 2025", before: before2, after: after2 },
    { badge: "Modern Coastal", date: "Sep 22, 2025", before: before3, after: after3 },
  ];

  /* Bottom nav icons (5), last is active */
  const NAV_ICONS = ["home", "search", "plus", "heart", "user"];

  return (
    <View style={[styles.pageRoot, { backgroundColor: theme.background }]}>
      <View style={[styles.mobileFrame, { width: frameWidth }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Header ===== */}
          <View style={styles.headerWrap}>
            <View style={styles.headerBg}>
              <Image source={{ uri: BG_IMAGE }} style={styles.headerImage} />
              {/* gradient-ish overlay using layered Views to match your CSS */}
              <View style={styles.overlayTop} />
              <View style={styles.overlayMiddle} />
              <View style={styles.overlayBottom} />

              {/* header icons */}
              <View style={styles.headerIconsRow}>
                <View style={styles.iconGroup}>
                  {headerIconsLeft.map((n) => (
                    <PressIcon key={n} name={n} />
                  ))}
                </View>
                <View style={styles.iconGroup}>
                  {headerIconsRight.map((n) => (
                    <PressIcon key={n} name={n} />
                  ))}
                </View>
              </View>
            </View>

            {/* profile info */}
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: PROFILE }} style={styles.avatar} />
                <View style={styles.avatarBadge}>
                  <Image
                    source={{
                      uri: "https://img.icons8.com/ios-filled/50/000000/paint-palette.png",
                    }}
                    style={{ width: 22, height: 22 }}
                  />
                </View>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>Anonymous User</Text>
                <Text style={styles.userBio} numberOfLines={1}>
                  Crafting beautiful spaces with modern minimalism
                </Text>
              </View>

              {/* stats (5 boxes) */}
              <View style={styles.statsRow}>
                {[
                  ["3000+", "History"],
                  ["1000+", "Liked"],
                  ["970", "Saved"],
                  ["1000+", "Following"],
                  ["156", "Posts"],
                ].map(([num, label]) => (
                  <StatBox key={label} number={num} label={label} />
                ))}
              </View>
            </View>
          </View>

          {/* ===== Style preferences ===== */}
          <View style={styles.stylePrefs}>
            <Text style={styles.sectionTitle}>My Style Preferences</Text>
            <View style={styles.badgesWrap}>
              {["Modern", "Minimalist", "Scandinavian", "Coastal"].map((b) => (
                <Tag key={b} text={b} />
              ))}
            </View>
          </View>

          {/* ===== Tabs ===== */}
          <View style={styles.tabsOuter}>
            <View style={styles.tabsRow}>
              {TAB_DATA.map(({ id, label, icon }) => (
                <TabButton
                  key={id}
                  active={activeTab === id}
                  label={label}
                  icon={icon}
                  onPress={() => toggleTab(id)}
                />
              ))}
            </View>
          </View>

          {/* ===== Tab Content (animated) ===== */}
          <View style={styles.tabContent}>
            <FadeSlide show={activeTab === "AI"} offset={10}>
              {activeTab === "AI" && (
                <StaggerIn
                  items={AI_CARDS.map(({ badge, date, before, after }, i) => (
                    <AICard key={`${badge}-${i}`} badge={badge} date={date} before={before} after={after} />
                  ))}
                />
              )}
            </FadeSlide>

            <FadeSlide show={activeTab === "saved"} offset={10}>
              {activeTab === "saved" && (
                <Gallery
                  images={[before1, after1, before2, after2]}
                />
              )}
            </FadeSlide>

            <FadeSlide show={activeTab === "liked"} offset={10}>
              {activeTab === "liked" && (
                <Gallery
                  images={[before1, after1, before2, after2, before3, after3]}
                />
              )}
            </FadeSlide>
          </View>
        </ScrollView>

        {/* ===== Bottom Nav ===== */}
        <View style={styles.bottomNav}>
          <View style={styles.navRow}>
            {NAV_ICONS.map((n, i) => (
              <NavIcon key={n} name={n} active={i === 4} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---------- Pieces ---------- */

function PressIcon({ name }: { name: string }) {
  const { scaleStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={[styles.iconBtn, scaleStyle]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Image
          source={{ uri: `https://img.icons8.com/ios/50/000000/${name}.png` }}
          style={styles.iconImg}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  const { scaleStyle, onPressIn, onPressOut } = usePressScale(1, 0.98);
  return (
    <Animated.View style={[styles.statBox, scaleStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function TabButton({
  active,
  label,
  icon,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: string;
  onPress: (e: GestureResponderEvent) => void;
}) {
  const { scaleStyle, onPressIn, onPressOut } = usePressScale(1, 0.97);
  return (
    <Animated.View
      style={[
        styles.tabBtn,
        active ? styles.tabBtnActive : styles.tabBtnInactive,
        scaleStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.tabIconWrap,
            active ? styles.tabIconWrapActive : styles.tabIconWrapInactive,
          ]}
        >
          <Image
            source={{ uri: `https://img.icons8.com/ios/50/000000/${icon}.png` }}
            style={[
              styles.tabIcon,
              active ? styles.tintWhite : styles.tintMuted,
            ]}
          />
        </View>
        <Text style={[styles.tabLabel, active ? styles.tabLabelActive : styles.tabLabelInactive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function AICard({
  badge,
  date,
  before,
  after,
}: {
  badge: string;
  date: string;
  before: string;
  after: string;
}) {
  const { scaleStyle, onPressIn, onPressOut } = usePressScale(1, 0.98);
  return (
    <Animated.View style={[styles.aiCard, scaleStyle]}>
      <TouchableOpacity activeOpacity={0.95} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.aiCardHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
          <Text style={styles.cardDate}>{date}</Text>
        </View>

        <View style={styles.beforeAfterRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.beforeAfterLabel}>Before</Text>
            <Image source={{ uri: before }} style={styles.beforeAfterImage} />
          </View>

          <View style={styles.arrowWrap}>
            <View style={styles.arrowCircle}>
              <Image
                source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/arrow.png" }}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.beforeAfterLabel}>After</Text>
            <Image source={{ uri: after }} style={styles.beforeAfterImage} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function Gallery({ images }: { images: string[] }) {
  return (
    <View style={styles.gridWrap}>
      {images.map((src, i) => (
        <Image key={i} source={{ uri: src }} style={styles.gridImage} />
      ))}
    </View>
  );
}

function NavIcon({ name, active }: { name: string; active?: boolean }) {
  const { scaleStyle, onPressIn, onPressOut } = usePressScale(1, 0.94);
  return (
    <Animated.View style={[styles.navBtn, active && styles.navBtnActive, scaleStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Image
          source={{ uri: `https://img.icons8.com/ios/50/000000/${name}.png` }}
          style={styles.navIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- Styles (faithfully ported from your CSS) ---------- */
const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileFrame: {
    flex: 1,
    maxWidth: MAX_FRAME_W,
    backgroundColor: theme.card,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* Header */
  headerWrap: { flexDirection: "column" },
  headerBg: { height: 200, position: "relative", overflow: "hidden" },
  headerImage: { width: "100%", height: "100%", position: "absolute" },

  // gradient-like overlay to match: transparent -> rgba(232,222,207,0.6) -> card
  overlayTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "45%",
    backgroundColor: "rgba(0,0,0,0)",
  },
  overlayMiddle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "45%",
    height: "25%",
    backgroundColor: "rgba(232,222,207,0.6)",
  },
  overlayBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    backgroundColor: theme.card,
  },

  headerIconsRow: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  iconGroup: {
    flexDirection: "row",
    columnGap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconImg: { width: 20, height: 20, tintColor: "#000" },

  /* Profile info */
  profileInfo: {
    paddingHorizontal: 20,
    marginTop: -64,
    zIndex: 5,
    alignItems: "center",
  },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: theme.card,
    borderWidth: 4,
    borderColor: theme.card,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  avatarBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8DECF",
    borderWidth: 3,
    borderColor: "#EFE6D9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    transform: [{ rotate: "5deg" }],
  },
  userInfo: { alignItems: "center", marginBottom: 16, alignSelf: "stretch" },
  userName: { color: theme.cardForeground, fontSize: 20, fontWeight: "600", marginBottom: 6 },
  userBio: {
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  /* Stats: 5 boxes */
  statsRow: {
    alignSelf: "stretch",
    paddingHorizontal: 10,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 2,
    borderColor: "#d4c4a8",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    aspectRatio: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.cardForeground,
    marginBottom: 3,
    lineHeight: 18,
  },
  statLabel: { fontSize: 10, color: "rgba(0,0,0,0.7)", fontWeight: "600", lineHeight: 12 },

  /* Preferences */
  stylePrefs: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    color: theme.mutedForeground,
    marginBottom: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  badgesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6 as any,
  },
  badge: {
    backgroundColor: theme.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 3,
  },
  badgeText: { color: theme.accentForeground, fontSize: 12, fontWeight: "500" },

  /* Tabs */
  tabsOuter: { paddingHorizontal: 20, paddingTop: 16 },
  tabsRow: { flexDirection: "row", columnGap: 8, width: "100%" },
  tabBtn: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tabBtnActive: { backgroundColor: "rgba(201,123,99,0.15)" },
  tabBtnInactive: { backgroundColor: "rgba(255,255,255,0.4)" },
  tabIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  tabIconWrapActive: { backgroundColor: theme.accent },
  tabIconWrapInactive: { backgroundColor: theme.muted },
  tabIcon: { width: 20, height: 20 },
  tintWhite: { tintColor: "#fff" },
  tintMuted: { tintColor: theme.mutedForeground },
  tabLabel: { fontSize: 12 },
  tabLabelActive: { color: theme.cardForeground, fontWeight: "600" },
  tabLabelInactive: { color: theme.mutedForeground },

  /* Tab Content */
  tabContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 96 },

  aiCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  aiCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardDate: { fontSize: 12, color: theme.mutedForeground },

  beforeAfterRow: { flexDirection: "row", alignItems: "center", columnGap: 12 },
  beforeAfterLabel: {
    fontSize: 11,
    color: theme.mutedForeground,
    marginBottom: 6,
    fontWeight: "600",
  },
  beforeAfterImage: { width: "100%", height: 140, borderRadius: 12 },
  arrowWrap: { alignItems: "center", justifyContent: "center" },
  arrowCircle: {
    backgroundColor: theme.accent,
    borderRadius: 999,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Gallery */
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridImage: {
    width: "48%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    marginBottom: 12,
  },

  /* Bottom nav */
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 12,
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navBtn: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 8,
    opacity: 0.7,
  },
  navBtnActive: {
    backgroundColor: "rgba(0,0,0,0.08)",
    opacity: 1,
  },
  navIcon: { width: 28, height: 28, tintColor: "#000" },
});
