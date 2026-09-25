import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import NavigationItem from "@/models/NavigationItem";
import SocialLink from "@/models/SocialLink";
import SEOSettings from "@/models/SEOSettings";
import {
  defaultSiteSettings,
  defaultNavigationItems,
  defaultSocialLinks,
  defaultSEOSettings,
} from "@/lib/initial-data";
import { apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) {
      // Graceful fallback to initial data if database is connecting
      return apiSuccess({
        settings: defaultSiteSettings,
        navigation: defaultNavigationItems,
        social: defaultSocialLinks,
        seo: defaultSEOSettings,
        dbConnected: false,
      });
    }

    const [settings, navigation, social, seo] = await Promise.all([
      SiteSettings.findOne().lean(),
      NavigationItem.find({ published: true }).sort({ sortOrder: 1 }).lean(),
      SocialLink.find({ published: true }).sort({ sortOrder: 1 }).lean(),
      SEOSettings.findOne().lean(),
    ]);

    return apiSuccess({
      settings: settings || defaultSiteSettings,
      navigation: navigation.length > 0 ? navigation : defaultNavigationItems,
      social: social.length > 0 ? social : defaultSocialLinks,
      seo: seo || defaultSEOSettings,
      dbConnected: true,
    });
  } catch (error) {
    console.error("[Settings API Error]", error);
    return apiSuccess({
      settings: defaultSiteSettings,
      navigation: defaultNavigationItems,
      social: defaultSocialLinks,
      seo: defaultSEOSettings,
      dbConnected: false,
    });
  }
}
