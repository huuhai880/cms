import MainNumberDetail from "components/MainNumber/MainNumberDetail";
import React from "react";

// Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
// .end#Dashboard

// Users
const Users = React.lazy(() => import("./components/Users/Users"));
const UserAdd = React.lazy(() => import("./components/Users/UserAdd"));
const UserDetail = React.lazy(() => import("./components/Users/UserDetail"));
const UserEdit = React.lazy(() => import("./components/Users/UserEdit"));
const UserDelete = React.lazy(() => import("./components/Users/UserDelete"));
const UserChangePassword = React.lazy(() => import("./components/Users/UserChangePassword"));
const ChangePassword = React.lazy(() => import("./components/Users/ChangePassword"));
//.end#Users

// // Letter
const Letter = React.lazy(() => import("./components/Letter/Letter"));
const LetterAdd = React.lazy(() => import("./components/Letter/LetterAdd"));
const LetterDetail = React.lazy(() => import("./components/Letter/LetterDetail"));
const LetterEdit = React.lazy(() => import("./components/Letter/LetterEdit"));
// //.end#Letter

// MainNumber
const MainNumber = React.lazy(() => import("./components/MainNumber/MainNumber"));
const MainNumberAdd = React.lazy(() => import("./components/MainNumber/MainNumberAdd"));
// const UserDetail = React.lazy(() => import("./components/Users/UserDetail"));
const MainNumberEdit = React.lazy(() => import("./components/MainNumber/MainNumberEdit"));
//.end#MainNumber

// UserGroups
const UserGroups = React.lazy(() => import("./components/UserGroups/UserGroups"));
const UserGroupsAdd = React.lazy(() => import("./components/UserGroups/UserGroupsAdd"));
const UserGroupsEdit = React.lazy(() => import("./components/UserGroups/UserGroupsEdit"));
//const UserGroupsDelete = React.lazy(() => import('./components/UserGroups/UserGroupsDelete'))
const UserGroupsDetail = React.lazy(() => import("./components/UserGroups/UserGroupsDetail"));
//.end#UsersGroups

// FunctionGroups
const FunctionGroups = React.lazy(() => import("./components/FunctionGroups/FunctionGroups"));
const FunctionGroupAdd = React.lazy(() => import("./components/FunctionGroups/FunctionGroupAdd"));
const FunctionGroupDetail = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupDetail")
);
const FunctionGroupEdit = React.lazy(() => import("./components/FunctionGroups/FunctionGroupEdit"));
const FunctionGroupDelete = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupDelete")
);
//.end#FunctionGroups

// Function
const Functions = React.lazy(() => import("./components/Functions/Functions"));
const FunctionAdd = React.lazy(() => import("./components/Functions/FunctionAdd"));
const FunctionDetail = React.lazy(() => import("./components/Functions/FunctionDetail"));
const FunctionEdit = React.lazy(() => import("./components/Functions/FunctionEdit"));
const FunctionDelete = React.lazy(() => import("./components/Functions/FunctionDelete"));
//.end#Function

// Menu
const Menus = React.lazy(() => import("./components/Menus/Menus"));
const MenuAdd = React.lazy(() => import("./components/Menus/MenuAdd"));
const MenuDetail = React.lazy(() => import("./components/Menus/MenuDetail"));
const MenuEdit = React.lazy(() => import("./components/Menus/MenuEdit"));
const MenuDelete = React.lazy(() => import("./components/Menus/MenuDelete"));
//.end#Menu

//CRM
const Campaigns = React.lazy(() => import("./components/Campaigns/Campaigns"));
const CampaignDetail = React.lazy(() => import("./components/Campaigns/CampaignDetail"));
const CampaignEdit = React.lazy(() => import("./components/Campaigns/CampaignEdit"));
const CampaignAdd = React.lazy(() => import("./components/Campaigns/CampaignAdd"));
const CampaignInitialization = React.lazy(() =>
  import("./components/Campaigns/CampaignInitialization")
);
//.end#CRM

//Campaign-type
const CampaignTypes = React.lazy(() => import("./components/CampaignTypes/CampaignTypes"));
const CampaignTypeDetail = React.lazy(() =>
  import("./components/CampaignTypes/CampaignTypeDetail")
);
const CampaignTypeEdit = React.lazy(() => import("./components/CampaignTypes/CampaignTypeEdit"));
const CampaignTypeAdd = React.lazy(() => import("./components/CampaignTypes/CampaignTypeAdd"));
//.end#Campaign-type

//CRM-campaign-status
const CampaignStatus = React.lazy(() => import("./components/CampaignStatus/CampaignStatus"));
const CampaignStatusDetail = React.lazy(() =>
  import("./components/CampaignStatus/CampaignStatusDetail")
);
const CampaignStatusEdit = React.lazy(() =>
  import("./components/CampaignStatus/CampaignStatusEdit")
);
const CampaignStatusAdd = React.lazy(() => import("./components/CampaignStatus/CampaignStatusAdd"));
//.end#CRM-campaign-status

// Business
const Businesses = React.lazy(() => import("./components/Businesses/Businesses"));
const BusinessAdd = React.lazy(() => import("./components/Businesses/BusinessAdd"));
const BusinessDetail = React.lazy(() => import("./components/Businesses/BusinessDetail"));
const BusinessEdit = React.lazy(() => import("./components/Businesses/BusinessEdit"));
//.end#Businesses

// BusinessType
const BusinessesType = React.lazy(() => import("./components/BusinessesType/BusinessesType"));
const BusinessTypeAdd = React.lazy(() => import("./components/BusinessesType/BusinessTypeAdd"));
const BusinessTypeDetail = React.lazy(() =>
  import("./components/BusinessesType/BusinessTypeDetail")
);
const BusinessTypeEdit = React.lazy(() => import("./components/BusinessesType/BusinessTypeEdit"));
//.end#BusinessType

// Company
const Companies = React.lazy(() => import("./components/Companies/Companies"));
const CompaniesAdd = React.lazy(() => import("./components/Companies/CompaniesAdd"));
const CompaniesDetail = React.lazy(() => import("./components/Companies/CompaniesDetail"));
// end#Company

// Segment
const Segment = React.lazy(() => import("./components/Segment/Segment"));
const SegmentAdd = React.lazy(() => import("./components/Segment/SegmentAdd"));
const SegmentDetail = React.lazy(() => import("./components/Segment/SegmentDetail"));
const SegmentEdit = React.lazy(() => import("./components/Segment/SegmentEdit"));
//.end#Segment

// Area
const Area = React.lazy(() => import("./components/Area/Area"));
const AreaAdd = React.lazy(() => import("./components/Area/AreaAdd"));
const AreaDetail = React.lazy(() => import("./components/Area/AreaDetail"));
const AreaEdit = React.lazy(() => import("./components/Area/AreaEdit"));
//.end#Area

// Order
const Order = React.lazy(() => import("./components/Order/Order"));
const OrderDetail = React.lazy(() => import("./components/Order/OrderDetail"));
//.end#Order

// Manufacturer
const Manufacturer = React.lazy(() => import("./components/Manufacturer/Manufacturer"));
const ManufacturerAdd = React.lazy(() => import("./components/Manufacturer/ManufacturerAdd"));
const ManufacturerDetail = React.lazy(() => import("./components/Manufacturer/ManufacturerDetail"));
const ManufacturerEdit = React.lazy(() => import("./components/Manufacturer/ManufacturerEdit"));
//.end#Manufacturer

// Permissions
const Permissions = React.lazy(() => import("./components/Permissions/Permissions"));
//.end#Permissions

//Thent:  StatusDataLead
const StatusDataLead = React.lazy(() => import("./components/StatusDataLead/StatusDataLead"));
const StatusDataLeadAdd = React.lazy(() => import("./components/StatusDataLead/StatusDataLeadAdd"));
const StatusDataLeadDetail = React.lazy(() =>
  import("./components/StatusDataLead/StatusDataLeadDetail")
);
const StatusDataLeadEdit = React.lazy(() =>
  import("./components/StatusDataLead/StatusDataLeadEdit")
);
//.end StatusDataLead

//Task-Workflows
const TaskWorkflows = React.lazy(() => import("./components/TaskWorkflows/TaskWorkflows"));
const TaskWorkflowDetail = React.lazy(() =>
  import("./components/TaskWorkflows/TaskWorkflowDetail")
);
const TaskWorkflowEdit = React.lazy(() => import("./components/TaskWorkflows/TaskWorkflowEdit"));
const TaskWorkflowAdd = React.lazy(() => import("./components/TaskWorkflows/TaskWorkflowAdd"));
//.end#Task-Workflows

//Task-Types
const TaskTypes = React.lazy(() => import("./components/TaskTypes/TaskTypes"));
const TaskTypeDetail = React.lazy(() => import("./components/TaskTypes/TaskTypeDetail"));
const TaskTypeEdit = React.lazy(() => import("./components/TaskTypes/TaskTypeEdit"));
const TaskTypeAdd = React.lazy(() => import("./components/TaskTypes/TaskTypeAdd"));
//.end#Task-Types

// Store
const Store = React.lazy(() => import("./components/Store/Store"));
const StoreAdd = React.lazy(() => import("./components/Store/StoreAdd"));
const StoreDetail = React.lazy(() => import("./components/Store/StoreDetail"));
const StoreEdit = React.lazy(() => import("./components/Store/StoreEdit"));
//.end#Store

// ParamDob
const ParamDob = React.lazy(() => import("./components/ParamDob/ParamDob"));
const ParamDobAdd = React.lazy(() => import("./components/ParamDob/ParamDobAdd"));
const ParamDobDetail = React.lazy(() => import("./components/ParamDob/ParamDobDetail"));
const ParamDobEdit = React.lazy(() => import("./components/ParamDob/ParamDobEdit"));
//.end#ParamDob
// RelationShips
const RelationShips = React.lazy(() => import("./components/RelationShips/RelationShips"));
const RelationShipsAdd = React.lazy(() => import("./components/RelationShips/RelationShipsAdd"));
const RelationShipsDetail = React.lazy(() =>
  import("./components/RelationShips/RelationShipsDetail")
);
const RelationShipsEdit = React.lazy(() => import("./components/RelationShips/RelationShipsEdit"));
//.end#RelationShips
//DepartMent
const DepartMent = React.lazy(() => import("./components/DepartMent/DepartMent"));
const DepartMentAdd = React.lazy(() => import("./components/DepartMent/DepartMentAdd"));
const DepartMentDetail = React.lazy(() => import("./components/DepartMent/DepartMentDetail"));
const DepartMentEdit = React.lazy(() => import("./components/DepartMent/DepartMentEdit"));
//.end#DepartMent

//CustomerDataLead
const CustomerDataLeads = React.lazy(() =>
  import("./components/CustomerDataLeads/CustomerDataLeads")
);
const CustomerDataLeadAdd = React.lazy(() =>
  import("./components/CustomerDataLeads/CustomerDataLeadAdd")
);
const CustomerDataLeadDetail = React.lazy(() =>
  import("./components/CustomerDataLeads/CustomerDataLeadDetail")
);
const CustomerDataLeadEdit = React.lazy(() =>
  import("./components/CustomerDataLeads/CustomerDataLeadEdit")
);
//.end#CustomerDataLead

// Task
const Task = React.lazy(() => import("./components/Task/Task"));
const TaskAdd = React.lazy(() => import("./components/Task/TaskAdd"));
const TaskDetail = React.lazy(() => import("./components/Task/TaskDetail"));
const TaskEdit = React.lazy(() => import("./components/Task/TaskEdit"));
const TaskCustomerDataLeadDetail = React.lazy(() =>
  import("./components/Task/TaskCustomerDataLeadDetail")
);
//.end#Task
// Position
const Position = React.lazy(() => import("./components/Position/Position"));
const PositionAdd = React.lazy(() => import("./components/Position/PositionAdd"));
// const TaskDetail = React.lazy(() => import("./components/Task/TaskDetail"));
const PositonEdit = React.lazy(() => import("./components/Position/PositonEdit"));
//.end#Positions
// BusinessUser
const BusinessUser = React.lazy(() => import("./components/BusinessUser/BusinessUser"));
const BusinessUserAdd = React.lazy(() => import("./components/BusinessUser/BusinessUserAdd"));
//.end#BusinessUser

//CustomerDataLeadCare
const CustomerDataLeadCareByTask = React.lazy(() =>
  import("./components/CustomerDataLeads/CustomerDataLeadCareByTask")
);
//.end#CustomerDataLeadCare

// ProductCategory
const ProductCategory = React.lazy(() => import("./components/ProductCategory/ProductCategory"));
const ProductCategoryAdd = React.lazy(() =>
  import("./components/ProductCategory/ProductCategoryAdd")
);
const ProductCategoryEdit = React.lazy(() =>
  import("./components/ProductCategory/ProductCategoryEdit")
);
const ProductCategoryDetail = React.lazy(() =>
  import("./components/ProductCategory/ProductCategoryDetail")
);
//.end#ProductCategory

// ProductAttribute
const ProductAttributes = React.lazy(() =>
  import("./components/ProductAttributes/ProductAttributes")
);
const ProductAttributeAdd = React.lazy(() =>
  import("./components/ProductAttributes/ProductAttributeAdd")
);
const ProductAttributeEdit = React.lazy(() =>
  import("./components/ProductAttributes/ProductAttributeEdit")
);
const ProductAttributeDetail = React.lazy(() =>
  import("./components/ProductAttributes/ProductAttributeDetail")
);
//.end#ProductAttribute

// Category
// const Category = React.lazy(() => import('./components/Category/Category'))
// const CategoryAdd = React.lazy(() => import('./components/Category/CategoryAdd'))
//.end#Category

// Product
const Product = React.lazy(() => import("./components/Product/Product"));
const ProductAdd = React.lazy(() => import("./components/Product/ProductAdd"));
const ProductDetail = React.lazy(() => import("./components/Product/ProductDetail"));
const ProductEdit = React.lazy(() => import("./components/Product/ProductEdit"));
//.end#Product

// Promotions
const Promotions = React.lazy(() => import("./components/Promotions/Promotions"));
const PromotionAdd = React.lazy(() => import("./components/Promotions/PromotionAdd"));
const PromotionDetail = React.lazy(() => import("./components/Promotions/PromotionDetail"));
const PromotionEdit = React.lazy(() => import("./components/Promotions/PromotionEdit"));
//.end#Promotions

// Price
const Price = React.lazy(() => import("./components/Price/Price"));
const PriceAdd = React.lazy(() => import("./components/Price/PriceAdd"));
const PriceEdit = React.lazy(() => import("./components/Price/PriceEdit"));
const PriceDetail = React.lazy(() => import("./components/Price/PriceDetail"));
//.end#Price

// customertype
const CustomerType = React.lazy(() => import("./components/CustomerType/CustomerType"));
const CustomerTypeAdd = React.lazy(() => import("./components/CustomerType/CustomerTypeAdd"));
const CustomerTypeDetail = React.lazy(() => import("./components/CustomerType/CustomerTypeDetail"));
const CustomerTypeEdit = React.lazy(() => import("./components/CustomerType/CustomerTypeEdit"));
//.end customertype

// PromotionOffers
const PromotionOffers = React.lazy(() => import("./components/PromotionOffers/PromotionOffers"));
const PromotionOfferAdd = React.lazy(() =>
  import("./components/PromotionOffers/PromotionOfferAdd")
);
const PromotionOfferDetail = React.lazy(() =>
  import("./components/PromotionOffers/PromotionOfferDetail")
);
const PromotionOfferEdit = React.lazy(() =>
  import("./components/PromotionOffers/PromotionOfferEdit")
);
//.end#PromotionOffers

// OutputType
const OutputType = React.lazy(() => import("./components/OutputType/OutputType"));
const OutputTypeAdd = React.lazy(() => import("./components/OutputType/OutputTypeAdd"));
const OutputTypeDetail = React.lazy(() => import("./components/OutputType/OutputTypeDetail"));
const OutputTypeEdit = React.lazy(() => import("./components/OutputType/OutputTypeEdit"));
//.end#OutputType

// // FormulaIngredients
// const FormulaIngredients = React.lazy(() =>
//   import("./components/FormulaIngredients/FormulaIngredients")
// );
// const FormulaIngredientsAdd = React.lazy(() =>
//   import("./components/FormulaIngredients/FormulaIngredientsAdd")
// );
// const FormulaIngredientsDetail = React.lazy(() =>
//   import("./components/FormulaIngredients/FormulaIngredientsDetail")
// );
// const FormulaIngredientsEdit = React.lazy(() =>
//   import("./components/FormulaIngredients/FormulaIngredientsEdit")
// );
// //.end#FormulaIngredients

// Formula
const Formula = React.lazy(() =>
  import("./components/Formula/Formula")
);
const FormulaAdd = React.lazy(() =>
  import("./components/Formula/FormulaAdd")
);
const FormulaDetail = React.lazy(() =>
  import("./components/Formula/FormulaDetail")
);
const FormulaEdit = React.lazy(() =>
  import("./components/Formula/FormulaEdit")
);
//.end#Formula


// Customer Time Keeping
const CustomerTimeKeeping = React.lazy(() =>
  import("./components/CustomerTimeKeeping/CustomerTimeKeeping")
);
//.end#Customer Time Keeping

// Admin Website: Topic
const Topic = React.lazy(() => import("./components/Topic/Topic"));
const TopicAdd = React.lazy(() => import("./components/Topic/TopicAdd"));
const TopicDetail = React.lazy(() => import("./components/Topic/TopicDetail"));
const TopicEdit = React.lazy(() => import("./components/Topic/TopicEdit"));
//.End

// Admin Website: Account
const Account = React.lazy(() => import("./components/Account/Account"));
const AccountAdd = React.lazy(() => import("./components/Account/AccountAdd"));
const AccountDetail = React.lazy(() => import("./components/Account/AccountDetail"));
const AccountEdit = React.lazy(() => import("./components/Account/AccountEdit"));
//.End
// Admin Website: News
const News = React.lazy(() => import("./components/News/News"));
const NewsAdd = React.lazy(() => import("./components/News/NewsAdd"));
const NewsDetail = React.lazy(() => import("./components/News/NewsDetail"));
const NewsEdit = React.lazy(() => import("./components/News/NewsEdit"));
const NewsComment = React.lazy(() => import("./components/Comment/Comment"));
//.End

// Banner
const Banner = React.lazy(() => import("./components/Banner/Banner"));
const BannerAdd = React.lazy(() => import("./components/Banner/BannerAdd"));
const BannerDetail = React.lazy(() => import("./components/Banner/BannerDetail"));
const BannerEdit = React.lazy(() => import("./components/Banner/BannerEdit"));
//.end#Banner

// BannerType
const BannerType = React.lazy(() => import("./components/BannerType/BannerType"));
const BannerTypeAdd = React.lazy(() => import("./components/BannerType/BannerTypeAdd"));
const BannerTypeDetail = React.lazy(() => import("./components/BannerType/BannerTypeDetail"));
const BannerTypeEdit = React.lazy(() => import("./components/BannerType/BannerTypeEdit"));
//.end#BannerType

// NewsCategory
const NewsCategory = React.lazy(() => import("./components/NewsCategory/NewsCategory"));
const NewsCategoryAdd = React.lazy(() => import("./components/NewsCategory/NewsCategoryAdd"));
const NewsCategoryDetail = React.lazy(() => import("./components/NewsCategory/NewsCategoryDetail"));
const NewsCategoryEdit = React.lazy(() => import("./components/NewsCategory/NewsCategoryEdit"));
//.end#NewsCategory

// NewsStatus
const NewsStatus = React.lazy(() => import("./components/NewsStatus/NewsStatus"));
const NewsStatusAdd = React.lazy(() => import("./components/NewsStatus/NewsStatusAdd"));
const NewsStatusDetail = React.lazy(() => import("./components/NewsStatus/NewsStatusDetail"));
const NewsStatusEdit = React.lazy(() => import("./components/NewsStatus/NewsStatusEdit"));
//.end#NewsCategory

//Start: Recruit
const Recruit = React.lazy(() => import("./components/Recruit/Recruit"));
const RecruitAdd = React.lazy(() => import("./components/Recruit/RecruitAdd"));
const RecruitDetail = React.lazy(() => import("./components/Recruit/RecruitDetail"));
const RecruitEdit = React.lazy(() => import("./components/Recruit/RecruitEdit"));
//End: Recruit

//Start: Candidate
const Candidate = React.lazy(() => import("./components/Candidate/Candidate"));
const CandidateAdd = React.lazy(() => import("./components/Candidate/CandidateAdd"));
const CandidateDetail = React.lazy(() => import("./components/Candidate/CandidateDetail"));
const CandidateEdit = React.lazy(() => import("./components/Candidate/CandidateEdit"));
//End: Candidate

// WebsiteCategory
const WebsiteCategory = React.lazy(() => import("./components/WebsiteCategory/WebsiteCategory"));
const WebsiteCategoryAdd = React.lazy(() =>
  import("./components/WebsiteCategory/WebsiteCategoryAdd")
);
const WebsiteCategoryDetail = React.lazy(() =>
  import("./components/WebsiteCategory/WebsiteCategoryDetail")
);
const WebsiteCategoryEdit = React.lazy(() =>
  import("./components/WebsiteCategory/WebsiteCategoryEdit")
);
//.end#WebsiteCategory

// Support
const Support = React.lazy(() => import("./components/Support/Support"));
const SupportAdd = React.lazy(() => import("./components/Support/SupportAdd"));
const SupportDetail = React.lazy(() => import("./components/Support/SupportDetail"));
const SupportEdit = React.lazy(() => import("./components/Support/SupportEdit"));
//.end#Support

// StaticContent
const StaticContent = React.lazy(() => import("./components/StaticContent/StaticContent"));
const StaticContentAdd = React.lazy(() => import("./components/StaticContent/StaticContentAdd"));
const StaticContentDetail = React.lazy(() =>
  import("./components/StaticContent/StaticContentDetail")
);
const StaticContentEdit = React.lazy(() => import("./components/StaticContent/StaticContentEdit"));
//.end#StaticContent

// SetupServiceRegister
const SetupServiceRegister = React.lazy(() =>
  import("./components/SetupServiceRegister/SetupServiceRegister")
);
const SetupServiceRegisterAdd = React.lazy(() =>
  import("./components/SetupServiceRegister/SetupServiceRegisterAdd")
);
const SetupServiceRegisterDetail = React.lazy(() =>
  import("./components/SetupServiceRegister/SetupServiceRegisterDetail")
);
const SetupServiceRegisterEdit = React.lazy(() =>
  import("./components/SetupServiceRegister/SetupServiceRegisterEdit")
);
//.end#SetupServiceRegister

//Start: Booking
const Booking = React.lazy(() => import("./components/Booking/Booking"));
const BookingAdd = React.lazy(() => import("./components/Booking/BookingAdd"));
const BookingDetail = React.lazy(() => import("./components/Booking/BookingDetail"));
const BookingEdit = React.lazy(() => import("./components/Booking/BookingEdit"));
//End: Booking

//Membership
const Membership = React.lazy(() => import("./components/Membership/Membership"));
//.end#Membership

//Contract
const Contracts = React.lazy(() => import("./components/Contracts/Contracts"));
const ContractDetail = React.lazy(() => import("./components/Contracts/ContractDetail"));
const ContractEdit = React.lazy(() => import("./components/Contracts/ContractEdit"));
const ContractPrint = React.lazy(() => import("./components/Contracts/ContractPrint"));
const ContractAdd = React.lazy(() => import("./components/Contracts/ContractAdd"));
const ContractTransfer = React.lazy(() => import("./components/Contracts/ContractTransfer"));
const ContractPrintTransfer = React.lazy(() =>
  import("./components/Contracts/ContractPrintTransfer")
);
const ContractFreeze = React.lazy(() => import("./components/Contracts/ContractFreeze"));
const ContractPrintFreeze = React.lazy(() => import("./components/Contracts/ContractPrintFreeze"));
//.end#Contract

//ContractTypes
const ContractTypes = React.lazy(() => import("./components/ContractTypes/ContractTypes"));
const ContractTypeDetail = React.lazy(() =>
  import("./components/ContractTypes/ContractTypeDetail")
);
const ContractTypeEdit = React.lazy(() => import("./components/ContractTypes/ContractTypeEdit"));
const ContractTypeAdd = React.lazy(() => import("./components/ContractTypes/ContractTypeAdd"));
//.end#ContractTypes

// User Time Keeping
const TimekeepingUsers = React.lazy(() => import("./components/Timekeeping/TimekeepingUsers"));
//.end#User Time Keeping

//ProductComment
const ProductListComment = React.lazy(() =>
  import("./components/ProductComment/ProductListComment")
);
const ProductComment = React.lazy(() => import("./components/ProductComment/ProductComment"));
const ProductCommentDetail = React.lazy(() =>
  import("./components/ProductComment/ProductCommentDetail")
);
const ProductCommentEdit = React.lazy(() =>
  import("./components/ProductComment/ProductCommentEdit")
);
const ProductCommentReplyAdd = React.lazy(() =>
  import("./components/ProductComment/ProductCommentReplyAdd")
);
//.end#ProductComment

//ProductComment
const SetupServices = React.lazy(() => import("./components/SetupServices/SetupServices"));
const SetupServicesAdd = React.lazy(() => import("./components/SetupServices/SetupServicesAdd"));
const SetupServicesDetail = React.lazy(() =>
  import("./components/SetupServices/SetupServicesDetail")
);
const SetupServicesEdit = React.lazy(() => import("./components/SetupServices/SetupServicesEdit"));
//.end#ProductComment

// Author
const Author = React.lazy(() => import("./components/Author/Author"));
const AuthorAdd = React.lazy(() => import("./components/Author/AuthorAdd"));
const AuthorDetail = React.lazy(() => import("./components/Author/AuthorDetail"));
const AuthorEdit = React.lazy(() => import("./components/Author/AuthorEdit"));
const AuthorDelete = React.lazy(() => import("./components/Author/AuthorDelete"));
const AuthorChangePassword = React.lazy(() => import("./components/Author/AuthorChangePassword"));
// const ChangePassword = React.lazy(() => import('./components/Author/ChangePassword'));
//.end#Author

//plan category
const PlanCategory = React.lazy(() => import("./components/PlanCategory/PlanCategory"));
const PlanCategoryAdd = React.lazy(() => import("./components/PlanCategory/PlanCategoryAdd"));
const PlanCategoryDetail = React.lazy(() => import("./components/PlanCategory/PlanCategoryDetail"));
const PlanCategoryEdit = React.lazy(() => import("./components/PlanCategory/PlanCategoryEdit"));
const PlanCategoryDelete = React.lazy(() => import("./components/PlanCategory/PlanCategoryDelete"));
//end#plan category

//plan
const Plan = React.lazy(() => import("./components/Plan/Plan"));
const PlanAdd = React.lazy(() => import("./components/Plan/PlanAdd"));
const PlanDetail = React.lazy(() => import("./components/Plan/PlanDetail"));
const PlanEdit = React.lazy(() => import("./components/Plan/PlanEdit"));
// const PlanDelete = React.lazy(() => import('./components/Plan/PlanDelete'));
//end#plan

//contact customer
const ContactCustomer = React.lazy(() => import("./components/ContactCustomer/ContactCustomer"));
// const ContactCustomerAdd = React.lazy(() => import('./components/ContactCustomer/ContactCustomerAdd'));
const ContactCustomerDetail = React.lazy(() =>
  import("./components/ContactCustomer/ContactCustomerDetail")
);
// const ContactCustomerEdit = React.lazy(() => import('./components/ContactCustomer/ContactCustomerEdit'));
// const ContactCustomerDelete = React.lazy(() => import('./components/ContactCustomer/ContactCustomerDelete'));
//end#contact customer

//publishing company
const PublishingCompany = React.lazy(() =>
  import("./components/PublishingCompany/PublishingCompany")
);
const PublishingCompanyAdd = React.lazy(() =>
  import("./components/PublishingCompany/PublishingCompanyAdd")
);
const PublishingCompanyEdit = React.lazy(() =>
  import("./components/PublishingCompany/PublishingCompanyEdit")
);
const PublishingCompanyDetail = React.lazy(() =>
  import("./components/PublishingCompany/PublishingCompanyDetail")
);

//Service
const Service = React.lazy(() => import("./components/Service/Service"));
const ServiceAdd = React.lazy(() => import("./components/Service/ServiceAdd"));
const ServiceDetail = React.lazy(() => import("./components/Service/ServiceDetail"));
const ServiceEdit = React.lazy(() => import("./components/Service/ServiceEdit"));
//end#Service

//Faq
const Faq = React.lazy(() => import("./components/Faq/Faq"));
const FaqAdd = React.lazy(() => import("./components/Faq/FaqAdd"));
const FaqDetail = React.lazy(() => import("./components/Faq/FaqDetail"));
const FaqEdit = React.lazy(() => import("./components/Faq/FaqEdit"));
//end#Faq

//Comment rating
const CommentRating = React.lazy(() => import("./components/CommentRating/CommentRating"));

//PageSetting
//Comment rating
const PageSetting = React.lazy(() => import("./components/PageSetting/PageSetting"));

//Partner
const Partner = React.lazy(() => import("./components/Partner/Partner"));
const PartnerAdd = React.lazy(() => import("./components/Partner/PartnerAdd"));
const PartnerDetail = React.lazy(() => import("./components/Partner/PartnerDetail"));
const PartnerEdit = React.lazy(() => import("./components/Partner/PartnerEdit"));
//end#Partner

//Review
const Review = React.lazy(() => import("./components/CrmReview/CrmReview"));
const ReviewAdd = React.lazy(() => import("./components/CrmReview/CrmReviewAdd"));
const ReviewDetail = React.lazy(() => import("./components/CrmReview/CrmReviewDetail"));
const ReviewEdit = React.lazy(() => import("./components/CrmReview/CrmReviewEdit"));
//end#Review

//Attributes
const Attributes = React.lazy(() => import("./components/Attributes/Attributes"));
const AttributesAdd = React.lazy(() => import("./components/Attributes/AttributesAdd"));
const AttributesDetail = React.lazy(() => import("./components/Attributes/AttributesDetail"));
const AttributesEdit = React.lazy(() => import("./components/Attributes/AttributesEdit"));
// end#Attributes

//InterPret
const InterPret = React.lazy(() => import("./components/InterPret/InterPret"));
const InterPretAdd = React.lazy(() => import("./components/InterPret/InterPretAdd"));
const InterPretDetail = React.lazy(() => import("./components/InterPret/InterPretDetail"));
const InterPretEdit = React.lazy(() => import("./components/InterPret/InterPretEdit"));
const InterPretView = React.lazy(() => import("./components/InterPret/ViewDetail"));
const InterPretCopy = React.lazy(() => import("./components/InterPret/InterPretCopy"));
// end#InterPret

//InterPretDetail
const InterPretChild = React.lazy(() => import("./components/InterPret/InterPretChild"));
const InterPretChildAdd = React.lazy(() => import("./components/InterPret/InterPretChildAdd"));
const InterPretChildDetail = React.lazy(() =>
  import("./components/InterPret/InterPretChildDetail")
);
const InterPretChildEdit = React.lazy(() => import("./components/InterPret/InterPretChildEdit"));
// end#InterPretDetail

//Calculation
const Calculation = React.lazy(() => import("./components/MdCalculation/Calculation"));
const CalculationAdd = React.lazy(() => import("./components/MdCalculation/CalculationAdd"));
const CalculationDetail = React.lazy(() => import("./components/MdCalculation/CalculationDetail"));
const CalculationEdit = React.lazy(() => import("./components/MdCalculation/CalculationEdit"));
// end#Calculation

//ParamName
const ParamName = React.lazy(() => import("./components/ParamName/ParamName"));
const ParamNameAdd = React.lazy(() => import("./components/ParamName/ParamNameAdd"));
const ParamNameDetail = React.lazy(() => import("./components/ParamName/ParamNameDetail"));
const ParamNameEdit = React.lazy(() => import("./components/ParamName/ParamNameEdit"));
// end#ParamName

//AttributesGroup
const AttributesGroup = React.lazy(() => import("./components/AttributesGroup/AttributesGroup"));
const AttributesGroupAdd = React.lazy(() =>
  import("./components/AttributesGroup/AttributesGroupAdd")
);
const AttributesGroupDetail = React.lazy(() =>
  import("./components/AttributesGroup/AttributesGroupDetail")
);
const AttributesGroupEdit = React.lazy(() =>
  import("./components/AttributesGroup/AttributesGroupEdit")
);
// end#AttributesGroup

//Formula
const FormulaByDob = React.lazy(() => import("./components/FormulaByDob/FormulaByDob"));
const FormulaByDobAdd = React.lazy(() => import("./components/FormulaByDob/FormulaByDobAdd"));
const FormulaByDobDetail = React.lazy(() => import("./components/FormulaByDob/FormulaByDobDetail"));
const FormulaByDobEdit = React.lazy(() => import("./components/FormulaByDob/FormulaByDobEdit"));
// end#Formula

//FormulaByName
const FormulaByName = React.lazy(() => import("./components/FormulaByName/FormulaByName"));
const FormulaByNameAdd = React.lazy(() => import("./components/FormulaByName/FormulaByNameAdd"));
const FormulaByNameDetail = React.lazy(() =>
  import("./components/FormulaByName/FormulaByNameDetail")
);
const FormulaByNameEdit = React.lazy(() => import("./components/FormulaByName/FormulaByNameEdit"));
// end#FormulaByName

const ProductCombo = React.lazy(() => import("./components/ProductCombo/ProductCombo"));
const ProductComboAdd = React.lazy(() => import("./components/ProductCombo/ProductComboAdd"));
const ProductComboEdit = React.lazy(() => import("./components/ProductCombo/ProductComboEdit"));
const ProductComboDetail = React.lazy(() => import("./components/ProductCombo/ProductComboDetail"));

const SearchHistory = React.lazy(() => import("./components/SearchHistory/SearchHistory"));
const SearchHistoryDetail = React.lazy(() =>
  import("./components/SearchHistory/SearchHistoryDetail")
);

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // dashboard
  {
    path: "/",
    exact: true,
    name: "Trang chủ",
    function: "DASHBOARD_VIEW",
    component: Dashboard,
    // component: () => {
    //   window._$g.rdr("/dashboard");
    //   return null;
    // },
  },
  //.end#dashboard
  // Users
  {
    path: "/users",
    exact: true,
    name: "Danh sách nhân viên",
    function: "SYS_USER_VIEW",
    component: Users,
  },
  {
    path: "/users/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_USER_ADD",
    component: UserAdd,
  },
  {
    path: "/users/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_USER_VIEW",
    component: UserDetail,
  },
  {
    path: "/users/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_USER_EDIT",
    component: UserEdit,
  },
  {
    path: "/users/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_USER_DEL",
    component: UserDelete,
  },
  {
    path: "/users/change-password/:id",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: "SYS_USER_PASSWORD",
    component: UserChangePassword,
  },
  {
    path: "/change-password",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: null,
    component: ChangePassword,
  },
  //.end#Users

  //UserGroup
  {
    path: "/user-groups",
    exact: true,
    name: "Danh sách nhóm người dùng",
    function: "SYS_USERGROUP_VIEW",
    component: UserGroups,
  },
  {
    path: "/user-groups/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_USERGROUP_ADD",
    component: UserGroupsAdd,
  },
  {
    path: "/user-groups/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_USERGROUP_VIEW",
    component: UserGroupsDetail,
  },
  {
    path: "/user-groups/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_USERGROUP_DEL",
  },
  {
    path: "/user-groups/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_USERGROUP_EDIT",
    component: UserGroupsEdit,
  },
  //.end#UserGroup

  //FunctionGroups
  {
    path: "/function-groups",
    exact: true,
    name: "Danh sách nhóm quyền",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: FunctionGroups,
  },
  {
    path: "/function-groups/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTIONGROUP_ADD",
    component: FunctionGroupAdd,
  },
  {
    path: "/function-groups/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTIONGROUP_EDIT",
    component: FunctionGroupEdit,
  },
  {
    path: "/function-groups/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_FUNCTIONGROUP_DEL",
    component: FunctionGroupDelete,
  },
  {
    path: "/function-groups/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: FunctionGroupDetail,
  },
  //.end#FunctionGroups

  //Functions
  {
    path: "/functions",
    exact: true,
    name: "Danh sách quyền",
    function: "SYS_FUNCTION_VIEW",
    component: Functions,
  },
  {
    path: "/functions/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTION_ADD",
    component: FunctionAdd,
  },
  {
    path: "/functions/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTION_EDIT",
    component: FunctionEdit,
  },
  {
    path: "/functions/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_FUNCTION_DEL",
    component: FunctionDelete,
  },
  {
    path: "/functions/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTION_VIEW",
    component: FunctionDetail,
  },
  //.end#Functions

  //Menus
  {
    path: "/menus",
    exact: true,
    name: "Danh sách menu",
    function: "SYS_MENU_VIEW",
    component: Menus,
  },
  {
    path: "/menus/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_MENU_ADD",
    component: MenuAdd,
  },
  {
    path: "/menus/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_MENU_EDIT",
    component: MenuEdit,
  },
  {
    path: "/menus/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_MENU_DEL",
    component: MenuDelete,
  },
  {
    path: "/menus/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_MENU_VIEW",
    component: MenuDetail,
  },
  //.end#Menus

  //CRM-campaign
  {
    path: "/campaigns",
    exact: true,
    name: "Danh sách chiến dịch",
    function: "CRM_CAMPAIGN_VIEW",
    component: Campaigns,
  },
  {
    path: "/campaigns/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CAMPAIGN_VIEW",
    component: CampaignDetail,
  },
  {
    path: "/campaigns/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_CAMPAIGN_EDIT",
    component: CampaignEdit,
  },
  {
    path: "/campaigns/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CAMPAIGN_ADD",
    component: CampaignAdd,
  },
  {
    path: "/campaigns/re-add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CAMPAIGN_ADD",
    component: CampaignInitialization,
  },
  //.end#CRM-campaign

  //campaign-type
  {
    path: "/campaign-types",
    exact: true,
    name: "Danh sách loại chiến dịch",
    function: "CRM_CAMPAIGNTYPE_VIEW",
    component: CampaignTypes,
  },
  {
    path: "/campaign-types/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CAMPAIGNTYPE_ADD",
    component: CampaignTypeAdd,
  },
  {
    path: "/campaign-types/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CAMPAIGNTYPE_VIEW",
    component: CampaignTypeDetail,
  },
  {
    path: "/campaign-types/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_CAMPAIGNTYPE_EDIT",
    component: CampaignTypeEdit,
  },
  //.end#campaign-type

  //campaign-status
  {
    path: "/campaign-status",
    exact: true,
    name: "Danh sách trạng thái chiến dịch",
    function: "CRM_CAMPAIGNSTATUS_VIEW",
    component: CampaignStatus,
  },
  {
    path: "/campaign-status/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CAMPAIGNSTATUS_VIEW",
    component: CampaignStatusDetail,
  },
  {
    path: "/campaign-status/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_CAMPAIGNSTATUS_EDIT",
    component: CampaignStatusEdit,
  },
  {
    path: "/campaign-status/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CAMPAIGNSTATUS_ADD",
    component: CampaignStatusAdd,
  },
  //.end#campaign-status

  // Business
  {
    path: "/businesses",
    exact: true,
    name: "Danh sách cơ sở",
    function: "AM_BUSINESS_VIEW",
    component: Businesses,
  },
  {
    path: "/businesses/add",
    exact: true,
    name: "Thêm mới",
    function: "AM_BUSINESS_ADD",
    component: BusinessAdd,
  },
  {
    path: "/businesses/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "AM_BUSINESS_VIEW",
    component: BusinessDetail,
  },
  {
    path: "/businesses/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "AM_BUSINESS_EDIT",
    component: BusinessEdit,
  },
  //.end#Business

  // BusinessType
  {
    path: "/businesses-type",
    exact: true,
    name: "Danh sách loại cơ sở",
    function: "AM_BUSINESSTYPE_VIEW",
    component: BusinessesType,
  },
  {
    path: "/businesses-type/add",
    exact: true,
    name: "Thêm mới",
    function: "AM_BUSINESSTYPE_ADD",
    component: BusinessTypeAdd,
  },
  {
    path: "/businesses-type/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "AM_BUSINESSTYPE_VIEW",
    component: BusinessTypeDetail,
  },
  {
    path: "/businesses-type/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "AM_BUSINESSTYPE_EDIT",
    component: BusinessTypeEdit,
  },
  //.end#BusinessType

  // Companies
  {
    path: "/companies",
    exact: true,
    name: "Danh sách công ty",
    function: "AM_COMPANY_VIEW",
    component: Companies,
  },
  {
    path: "/companies/add",
    exact: true,
    name: "Thêm mới",
    function: "AM_COMPANY_ADD",
    component: CompaniesAdd,
  },
  {
    path: "/companies/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "AM_COMPANY_VIEW",
    component: CompaniesDetail,
  },
  {
    path: "/companies/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "AM_COMPANY_EDIT",
    component: CompaniesAdd,
  },
  // .end#Companies

  // permissions
  {
    path: "/permissions",
    exact: true,
    name: "Phân quyền",
    function: "PERMISSION_VIEW",
    component: Permissions,
  },
  //.end#permissions

  //Thent:  StatusDataLead
  {
    path: "/status-data-lead",
    exact: true,
    name: "Danh sách trạng thái khách hàng tiềm năng",
    function: "AM_STATUSDATALEAD_VIEW",
    component: StatusDataLead,
  },
  {
    path: "/status-data-lead/add",
    exact: true,
    name: "Thêm mới",
    function: "AM_STATUSDATALEAD_ADD",
    component: StatusDataLeadAdd,
  },
  {
    path: "/status-data-lead/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "AM_STATUSDATALEAD_VIEW",
    component: StatusDataLeadDetail,
  },
  {
    path: "/status-data-lead/delete/:id",
    exact: true,
    name: "Xóa",
    function: "AM_STATUSDATALEAD_DEL",
  },
  {
    path: "/status-data-lead/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "AM_STATUSDATALEAD_EDIT",
    component: StatusDataLeadEdit,
  },
  //.end#StatusDataLead

  // Segment
  {
    path: "/segment",
    exact: true,
    name: "Danh sách phân khúc",
    function: "CRM_SEGMENT_VIEW",
    component: Segment,
  },
  {
    path: "/segment/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_SEGMENT_ADD",
    component: SegmentAdd,
  },
  {
    path: "/segment/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_SEGMENT_VIEW",
    component: SegmentDetail,
  },
  {
    path: "/segment/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_SEGMENT_EDIT",
    component: SegmentEdit,
  },
  //.end#Segment

  //task-workflow
  {
    path: "/task-workflows",
    exact: true,
    name: "Danh sách bước xử lý công việc",
    function: "CRM_TASKWORKFLOW_VIEW",
    component: TaskWorkflows,
  },
  {
    path: "/task-workflows/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_TASKWORKFLOW_ADD",
    component: TaskWorkflowAdd,
  },
  {
    path: "/task-workflows/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_TASKWORKFLOW_VIEW",
    component: TaskWorkflowDetail,
  },
  {
    path: "/task-workflows/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_TASKWORKFLOW_EDIT",
    component: TaskWorkflowEdit,
  },
  //.end#task-workflow

  //task-type
  {
    path: "/task-types",
    exact: true,
    name: "Danh sách loại công việc",
    function: "CRM_TASKTYPE_VIEW",
    component: TaskTypes,
  },
  {
    path: "/task-types/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_TASKTYPE_ADD",
    component: TaskTypeAdd,
  },
  {
    path: "/task-types/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_TASKTYPE_VIEW",
    component: TaskTypeDetail,
  },
  {
    path: "/task-types/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_TASKTYPE_EDIT",
    component: TaskTypeEdit,
  },
  //.end#task-type

  // Area
  {
    path: "/area",
    exact: true,
    name: "Danh sách khu vực",
    function: "MD_AREA_VIEW",
    component: Area,
  },
  {
    path: "/area/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_AREA_ADD",
    component: AreaAdd,
  },
  {
    path: "/area/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_AREA_VIEW",
    component: AreaDetail,
  },
  {
    path: "/area/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_AREA_EDIT",
    component: AreaEdit,
  },
  //.end#Area

  // Manufacturer
  {
    path: "/manufacturer",
    exact: true,
    name: "Danh sách nhà sản xuất",
    function: "MD_MANUFACTURER_VIEW",
    component: Manufacturer,
  },
  {
    path: "/manufacturer/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_MANUFACTURER_ADD",
    component: ManufacturerAdd,
  },
  {
    path: "/manufacturer/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_MANUFACTURER_VIEW",
    component: ManufacturerDetail,
  },
  {
    path: "/manufacturer/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_MANUFACTURER_EDIT",
    component: ManufacturerEdit,
  },
  //.end#Manufacturer

  // Store
  {
    path: "/store",
    exact: true,
    name: "Danh sách cửa hàng",
    function: "MD_STORE_VIEW",
    component: Store,
  },
  {
    path: "/store/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_STORE_ADD",
    component: StoreAdd,
  },
  {
    path: "/store/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_STORE_VIEW",
    component: StoreDetail,
  },
  {
    path: "/store/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_STORE_EDIT",
    component: StoreEdit,
  },
  //.end#Store

  //DepartMent
  {
    path: "/department",
    exact: true,
    name: "Danh sách phòng ban",
    function: "MD_DEPARTMENT_VIEW",
    component: DepartMent,
  },
  {
    path: "/department/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_DEPARTMENT_ADD",
    component: DepartMentAdd,
  },
  {
    path: "/department/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_DEPARTMENT_VIEW",
    component: DepartMentDetail,
  },
  {
    path: "/department/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_DEPARTMENT_EDIT",
    component: DepartMentEdit,
  },
  //.end#DepartMent

  // Task
  {
    path: "/task",
    exact: true,
    name: "Danh sách công việc",
    function: "CRM_TASK_VIEW",
    component: Task,
  },
  {
    path: "/task/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_TASK_ADD",
    component: TaskAdd,
  },
  {
    path: "/task/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_TASK_VIEW",
    component: TaskDetail,
  },
  {
    path: "/task/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_TASK_EDIT",
    component: TaskEdit,
  },
  {
    path: "/task/customers/:id",
    exact: true,
    name: "Danh sách khách hàng thuộc công việc",
    function: "CRM_TASK_VIEW",
    component: TaskCustomerDataLeadDetail,
  },
  //.end#Task

  //CustomerDataLead
  {
    path: "/customer-data-leads",
    exact: true,
    name: "Danh sách khách hàng",
    function: "CRM_CUSDATALEADS_VIEW",
    component: CustomerDataLeads,
  },
  {
    path: "/customer-data-leads/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CUSDATALEADS_ADD",
    component: CustomerDataLeadAdd,
  },
  {
    path: "/customer-data-leads/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CUSDATALEADS_VIEW",
    component: CustomerDataLeadDetail,
  },
  {
    path: "/customer-data-leads/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_CUSDATALEADS_EDIT",
    component: CustomerDataLeadEdit,
  },
  {
    path: "/task/customers/:taskid/:id",
    exact: true,
    name: "Chi tiết chăm sóc khách hàng",
    function: "CRM_CUSDATALEADSDETAIL_VIEW",
    component: CustomerDataLeadCareByTask,
  },
  //.end#CustomerDataLeadCare

  {
    path: "/business-user",
    exact: true,
    name: "Phân nhân viên - Cơ sở",
    function: "SYS_BUSINESS_USER_VIEW",
    component: BusinessUser,
  },
  {
    path: "/business-user/add/:businessId",
    exact: true,
    name: "Thêm nhân viên vào cơ sở",
    function: "SYS_BUSINESS_USER_ADD",
    component: BusinessUserAdd,
  },

  // ProductCategory
  {
    path: "/product-category",
    exact: true,
    name: "Danh mục sản phẩm",
    function: "MD_PRODUCTCATEGORY_VIEW",
    component: ProductCategory,
  },
  {
    path: "/product-category/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PRODUCTCATEGORY_ADD",
    component: ProductCategoryAdd,
  },
  {
    path: "/product-category/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PRODUCTCATEGORY_EDIT",
    component: ProductCategoryEdit,
  },
  {
    path: "/product-category/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PRODUCTCATEGORY_VIEW",
    component: ProductCategoryDetail,
  },
  //.end#ProductCategory

  // ProductAttribute
  {
    path: "/product-attributes",
    exact: true,
    name: "Thuộc tính sản phẩm",
    function: "PRO_PRODUCTATTRIBUTE_VIEW",
    component: ProductAttributes,
  },
  {
    path: "/product-attributes/add",
    exact: true,
    name: "Thêm mới",
    function: "PRO_PRODUCTATTRIBUTE_ADD",
    component: ProductAttributeAdd,
  },
  {
    path: "/product-attributes/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "PRO_PRODUCTATTRIBUTE_EDIT",
    component: ProductAttributeEdit,
  },
  {
    path: "/product-attributes/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "PRO_PRODUCTATTRIBUTE_VIEW",
    component: ProductAttributeDetail,
  },
  //.end#ProductAttribute

  // Product
  {
    path: "/product",
    exact: true,
    name: "Danh sách sản phẩm",
    function: "MD_PRODUCT_VIEW",
    component: Product,
  },
  {
    path: "/product/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PRODUCT_ADD",
    component: ProductAdd,
  },
  {
    path: "/product/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PRODUCT_VIEW",
    component: ProductDetail,
  },
  {
    path: "/product/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PRODUCT_EDIT",
    component: ProductEdit,
  },
  //.end#Product

  // Promotions
  {
    path: "/promotions",
    exact: true,
    name: "Chương trình khuyến mại",
    function: "SM_PROMOTION_VIEW",
    component: Promotions,
  },
  {
    path: "/promotions/add",
    exact: true,
    name: "Thêm mới",
    function: "SM_PROMOTION_ADD",
    component: PromotionAdd,
  },
  {
    path: "/promotions/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SM_PROMOTION_VIEW",
    component: PromotionDetail,
  },
  {
    path: "/promotions/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SM_PROMOTION_EDIT",
    component: PromotionEdit,
  },
  //.end#Promotions

  // Price
  {
    path: "/price",
    exact: true,
    name: "Danh sách giá sản phẩm",
    function: "SL_PRICE_VIEW",
    component: Price,
  },
  {
    path: "/price/add",
    exact: true,
    name: "Làm giá",
    function: "SL_PRICE_ADD",
    component: PriceAdd,
  },
  {
    path: "/price/detail/:id",
    exact: true,
    name: "Chi tiết giá",
    function: "SL_PRICE_VIEW",
    component: PriceDetail,
  },
  {
    path: "/price/edit/:id",
    exact: true,
    name: "Chỉnh sửa giá",
    function: "SL_PRICE_EDIT",
    component: PriceEdit,
  },
  //.end#Prices

  //CustomerType
  {
    path: "/customer-type",
    exact: true,
    name: "Danh sách loại khách hàng",
    function: "CRM_CUSTOMERTYPE_VIEW",
    component: CustomerType,
  },
  {
    path: "/customer-type/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_CUSTOMERTYPE_ADD",
    component: CustomerTypeAdd,
  },
  {
    path: "/customer-type/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CUSTOMERTYPE_VIEW",
    component: CustomerTypeDetail,
  },
  {
    path: "/customer-type/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_CUSTOMERTYPE_EDIT",
    component: CustomerTypeEdit,
  },
  //.end CustomerType

  // PromotionOffers
  {
    path: "/promotion-offers",
    exact: true,
    name: "Ưu đãi khuyến mại",
    function: "SM_PROMOTIONOFFER_VIEW",
    component: PromotionOffers,
  },
  {
    path: "/promotion-offers/add",
    exact: true,
    name: "Thêm mới",
    function: "SM_PROMOTIONOFFER_ADD",
    component: PromotionOfferAdd,
  },
  {
    path: "/promotion-offers/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SM_PROMOTIONOFFER_VIEW",
    component: PromotionOfferDetail,
  },
  {
    path: "/promotion-offers/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SM_PROMOTIONOFFER_EDIT",
    component: PromotionOfferEdit,
  },
  //.end#PromotionOffers

  // OutputType
  {
    path: "/output-type",
    exact: true,
    name: "Hình thức sản phẩm",
    function: "SL_OUTPUTTYPE_VIEW",
    component: OutputType,
  },
  {
    path: "/output-type/add",
    exact: true,
    name: "Thêm mới",
    function: "SL_OUTPUTTYPE_ADD",
    component: OutputTypeAdd,
  },
  {
    path: "/output-type/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SL_OUTPUTTYPE_VIEW",
    component: OutputTypeDetail,
  },
  {
    path: "/output-type/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SL_OUTPUTTYPE_EDIT",
    component: OutputTypeEdit,
  },
  //.end#OutputType

  // Customer Time Keeping
  {
    path: "/customer-timekeeping",
    exact: true,
    name: "Check in/ Check out",
    function: "",
    component: CustomerTimeKeeping,
  },
  //.end#Customer Time Keeping

  // Admin Website: Topic
  {
    path: "/topic",
    exact: true,
    name: "Danh sách chủ đề",
    function: "CMS_TOPIC_VIEW",
    component: Topic,
  },
  {
    path: "/topic/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_TOPIC_ADD",
    component: TopicAdd,
  },
  {
    path: "/topic/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_TOPIC_VIEW",
    component: TopicDetail,
  },
  {
    path: "/topic/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_TOPIC_EDIT",
    component: TopicEdit,
  },

  // Admin Website: Account
  {
    path: "/account",
    exact: true,
    name: "Danh sách khách hàng",
    function: "CRM_ACCOUNT_VIEW",
    component: Account,
  },
  {
    path: "/account/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_ACCOUNT_ADD",
    component: AccountAdd,
  },
  {
    path: "/account/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_ACCOUNT_VIEW",
    component: AccountDetail,
  },
  {
    path: "/account/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_ACCOUNT_EDIT",
    component: AccountEdit,
  },
  // {
  //   path: "/account/account-change-password/:id",
  //   exact: true,
  //   name: "Thay đổi mật khẩu",
  //   function: "SYS_ACCOUNT_PASSWORD",
  //   component: AccountChangePassword,
  // },
  // {
  //   path: "/acc-change-password",
  //   exact: true,
  //   name: "Thay đổi mật khẩu",
  //   function: null,
  //   component: AccChangePassword,
  // },
  //.End
  // Admin Website: News
  {
    path: "/news",
    exact: true,
    name: "Danh sách bài viết",
    function: "NEWS_NEWS_VIEW",
    component: News,
  },
  {
    path: "/news/add",
    exact: true,
    name: "Thêm mới",
    function: "NEWS_NEWS_ADD",
    component: NewsAdd,
  },
  {
    path: "/news/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "NEWS_NEWS_VIEW",
    component: NewsDetail,
  },
  {
    path: "/news/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "NEWS_NEWS_EDIT",
    component: NewsEdit,
  },
  {
    path: "/news/comment/:id",
    exact: true,
    name: "Bình luận",
    function: "NEWS_NEWS_COMMENT_VIEW",
    component: NewsComment,
  },
  //.End

  // Banner
  {
    path: "/banner",
    exact: true,
    name: "Banner",
    function: "CMS_BANNER_VIEW",
    component: Banner,
  },
  {
    path: "/banner/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_BANNER_ADD",
    component: BannerAdd,
  },
  {
    path: "/banner/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_BANNER_VIEW",
    component: BannerDetail,
  },
  {
    path: "/banner/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_BANNER_EDIT",
    component: BannerEdit,
  },
  //.end#BannerType

  // BannerType
  {
    path: "/banner-type",
    exact: true,
    name: "Loại banner",
    function: "CMS_BANNERTYPE_VIEW",
    component: BannerType,
  },
  {
    path: "/banner-type/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_BANNERTYPE_ADD",
    component: BannerTypeAdd,
  },
  {
    path: "/banner-type/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_BANNERTYPE_VIEW",
    component: BannerTypeDetail,
  },
  {
    path: "/banner-type/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_BANNERTYPE_EDIT",
    component: BannerTypeEdit,
  },
  //.end#BannerType

  // NewsCategory
  {
    path: "/news-category",
    exact: true,
    name: "Chuyên mục tin tức",
    function: "NEWS_NEWSCATEGORY_VIEW",
    component: NewsCategory,
  },
  {
    path: "/news-category/add",
    exact: true,
    name: "Thêm mới",
    function: "NEWS_NEWSCATEGORY_ADD",
    component: NewsCategoryAdd,
  },
  {
    path: "/news-category/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "NEWS_NEWSCATEGORY_VIEW",
    component: NewsCategoryDetail,
  },
  {
    path: "/news-category/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "NEWS_NEWSCATEGORY_EDIT",
    component: NewsCategoryEdit,
  },
  //.end#NewsCategory

  // NewsStatus
  {
    path: "/news-status",
    exact: true,
    name: "Trạng thái tin tức",
    function: "NEWS_NEWSSTATUS_VIEW",
    component: NewsStatus,
  },
  {
    path: "/news-status/add",
    exact: true,
    name: "Thêm mới",
    function: "NEWS_NEWSSTATUS_ADD",
    component: NewsStatusAdd,
  },
  {
    path: "/news-status/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "NEWS_NEWSSTATUS_VIEW",
    component: NewsStatusDetail,
  },
  {
    path: "/news-status/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "NEWS_NEWSSTATUS_EDIT",
    component: NewsStatusEdit,
  },
  //.end#NewsStatus

  //Start: Recruit
  {
    path: "/recruit",
    exact: true,
    name: "Danh sách tuyển dụng",
    function: "HR_RECRUIT_VIEW",
    component: Recruit,
  },
  {
    path: "/recruit/add",
    exact: true,
    name: "Thêm mới",
    function: "HR_RECRUIT_ADD",
    component: RecruitAdd,
  },
  {
    path: "/recruit/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "HR_RECRUIT_VIEW",
    component: RecruitDetail,
  },
  {
    path: "/recruit/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "HR_RECRUIT_EDIT",
    component: RecruitEdit,
  },
  //.End

  //Start: Candidate
  {
    path: "/candidate",
    exact: true,
    name: "Danh sách tuyển dụng",
    function: "HR_CANDIDATE_VIEW",
    component: Candidate,
  },
  {
    path: "/candidate/add",
    exact: true,
    name: "Thêm mới",
    function: "HR_CANDIDATE_ADD",
    component: CandidateAdd,
  },
  {
    path: "/candidate/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "HR_CANDIDATE_VIEW",
    component: CandidateDetail,
  },
  {
    path: "/candidate/edit/:id",
    exact: true,
    name: "Thông tin",
    function: "HR_CANDIDATE_EDIT",
    component: CandidateEdit,
  },
  //.End

  // WebsiteCategory
  {
    path: "/website-category",
    exact: true,
    name: "Danh mục website",
    function: "CMS_WEBSITECATE_VIEW",
    component: WebsiteCategory,
  },
  {
    path: "/website-category/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_WEBSITECATE_ADD",
    component: WebsiteCategoryAdd,
  },
  {
    path: "/website-category/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_WEBSITECATE_VIEW",
    component: WebsiteCategoryDetail,
  },
  {
    path: "/website-category/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_WEBSITECATE_EDIT",
    component: WebsiteCategoryEdit,
  },
  //.end#WebsiteCategory

  // Support
  {
    path: "/support",
    exact: true,
    name: "Danh mục Liên hệ",
    function: "CMS_SUPPORT_VIEW",
    component: Support,
  },
  {
    path: "/support/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_SUPPORT_ADD",
    component: SupportAdd,
  },
  {
    path: "/support/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_SUPPORT_VIEW",
    component: SupportDetail,
  },
  {
    path: "/support/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_SUPPORT_EDIT",
    component: SupportEdit,
  },
  //.end#Support

  // StaticContent
  {
    path: "/static-content",
    exact: true,
    name: "Nội dung trang tĩnh",
    function: "CMS_STATICCONTENT_VIEW",
    component: StaticContent,
  },
  {
    path: "/static-content/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_STATICCONTENT_ADD",
    component: StaticContentAdd,
  },
  {
    path: "/static-content/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_STATICCONTENT_VIEW",
    component: StaticContentDetail,
  },
  {
    path: "/static-content/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_STATICCONTENT_EDIT",
    component: StaticContentEdit,
  },
  //.end#StaticContent

  // SetupServiceRegister
  {
    path: "/setup-service-register",
    exact: true,
    name: "Thông tin đăng ký setup phòng tập",
    function: "CMS_SETUPREGISTER_VIEW",
    component: SetupServiceRegister,
  },
  {
    path: "/setup-service-register/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_SETUPREGISTER_ADD",
    component: SetupServiceRegisterAdd,
  },
  {
    path: "/setup-service-register/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_SETUPREGISTER_VIEW",
    component: SetupServiceRegisterDetail,
  },
  {
    path: "/setup-service-register/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_SETUPREGISTER_EDIT",
    component: SetupServiceRegisterEdit,
  },
  //.end#SetupServiceRegister

  //Start: Booking
  {
    path: "/booking",
    exact: true,
    name: "Danh sách đơn đặt hàng",
    function: "SL_BOOKING_VIEW",
    component: Booking,
  },
  {
    path: "/booking/add",
    exact: true,
    name: "Thêm mới",
    function: "SL_BOOKING_ADD",
    component: BookingAdd,
  },
  {
    path: "/booking/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SL_BOOKING_VIEW",
    component: BookingDetail,
  },
  {
    path: "/booking/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SL_BOOKING_EDIT",
    component: BookingEdit,
  },
  //.End

  //Membership
  {
    path: "/membership",
    exact: true,
    name: "Danh sách thành viên",
    function: "CRM_MEMBERSHIP_VIEW",
    component: Membership,
  },
  //.end#Membership

  //Contract
  {
    path: "/contracts",
    exact: true,
    name: "Danh sách hợp đồng",
    function: "CT_CONTRACT_VIEW",
    component: Contracts,
  },
  {
    path: "/contracts/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "CT_CONTRACT_VIEW",
    component: ContractDetail,
  },
  {
    path: "/contracts/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CT_CONTRACT_EDIT",
    component: ContractEdit,
  },
  {
    path: "/contracts/add",
    exact: true,
    name: "Thêm mới",
    function: "CT_CONTRACT_ADD",
    component: ContractAdd,
  },
  {
    path: "/contracts/print/:id",
    exact: true,
    name: "In",
    function: "CT_CONTRACT_VIEW",
    component: ContractPrint,
  },
  {
    path: "/task/customers/:taskid/:dlid/add-contract",
    exact: true,
    name: "Tạo hợp đồng",
    function: "CT_CONTRACT_ADD",
    component: ContractAdd,
  },
  {
    path: "/contracts/transfer/:id",
    exact: true,
    name: "Chuyển nhượng",
    function: "CT_CONTRACT_ADD",
    component: ContractTransfer,
  },
  {
    path: "/contracts/transfer/:id/print",
    exact: true,
    name: "In thông tin chuyển nhượng",
    function: "CT_CONTRACT_ADD",
    component: ContractPrintTransfer,
  },
  {
    path: "/contracts/freeze/:id",
    exact: true,
    name: "Thêm mới thông tin bảo lưu",
    function: "CT_CONTRACT_ADD",
    component: ContractFreeze,
  },
  {
    path: "/contracts/freeze/:id/print",
    exact: true,
    name: "In thông tin bảo lưu",
    function: "CT_CONTRACT_VIEW",
    component: ContractPrintFreeze,
  },
  //.end#Contract

  //ContractTypes
  {
    path: "/contract-types",
    exact: true,
    name: "Danh sách loại hợp đồng",
    function: "MD_CONTRACTTYPE_VIEW",
    component: ContractTypes,
  },
  {
    path: "/contract-types/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_CONTRACTTYPE_VIEW",
    component: ContractTypeDetail,
  },
  {
    path: "/contract-types/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_CONTRACTTYPE_EDIT",
    component: ContractTypeEdit,
  },
  {
    path: "/contract-types/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_CONTRACTTYPE_ADD",
    component: ContractTypeAdd,
  },
  //.end#ContractTypes
  //.end#OutputType

  // User Time Keeping
  {
    path: "/user-timekeeping",
    exact: true,
    name: "Danh sách chấm công nhân viên",
    function: "USER_TIMEKEEPING_VIEW",
    component: TimekeepingUsers,
  },
  //.end#User Time Keeping

  //ProductComment
  {
    path: "/product-list-comment",
    exact: true,
    name: "Danh sách sản phẩm bình luận",
    function: "MD_PRODUCT_LIST_COMMENT_VIEW",
    component: ProductListComment,
  },
  {
    path: "/product-comment/:id",
    exact: true,
    name: "Danh sách bình luận",
    function: "PRO_COMMENT_VIEW",
    component: ProductComment,
  },
  {
    path: "/product-comment/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "PRO_COMMENT_VIEW",
    component: ProductCommentDetail,
  },
  {
    path: "/product-comment/edit/:id",
    exact: true,
    name: "Chi tiết",
    function: "PRO_COMMENT_EDIT",
    component: ProductCommentEdit,
  },
  {
    path: "/product-comment/add/:id",
    exact: true,
    name: "Chi tiết",
    function: "PRO_COMMENT_REPLY",
    component: ProductCommentReplyAdd,
  },
  //.end#ProductComment
  // SetupServiceRegister
  {
    path: "/setup-service",
    exact: true,
    name: "Danh sách dịch vụ setup",
    function: "CMS_SETUPSERVICE_VIEW",
    component: SetupServices,
  },
  {
    path: "/setup-service/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_SETUPSERVICE_ADD",
    component: SetupServicesAdd,
  },
  {
    path: "/setup-service/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_SETUPSERVICE_VIEW",
    component: SetupServicesDetail,
  },
  {
    path: "/setup-service/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_SETUPSERVICE_EDIT",
    component: SetupServicesEdit,
  },
  //.end#SetupServiceRegister

  // Author
  {
    path: "/author",
    exact: true,
    name: "Danh sách tác giả",
    function: "CRM_AUTHOR_VIEW",
    component: Author,
  },
  {
    path: "/author/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_AUTHOR_ADD",
    component: AuthorAdd,
  },
  {
    path: "/author/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_AUTHOR_VIEW",
    component: AuthorDetail,
  },
  {
    path: "/author/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_AUTHOR_EDIT",
    component: AuthorEdit,
  },
  {
    path: "/author/delete/:id",
    exact: true,
    name: "Xóa",
    function: "CRM_AUTHOR_DEL",
    component: AuthorDelete,
  },
  {
    path: "/author/change-password/:id",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: "CRM_AUTHOR_PASSWORD",
    component: AuthorChangePassword,
  },
  // { path: '/author/change-password', exact: true, name: 'Thay đổi mật khẩu', function: null, component: ChangePassword },
  //.end#Author

  // Plan category
  {
    path: "/plan-category",
    exact: true,
    name: "Danh sách danh mục dự án",
    function: "MD_PLANCATEGORY_VIEW",
    component: PlanCategory,
  },
  {
    path: "/plan-category/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PLANCATEGORY_ADD",
    component: PlanCategoryAdd,
  },
  {
    path: "/plan-category/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PLANCATEGORY_VIEW",
    component: PlanCategoryDetail,
  },
  {
    path: "/plan-category/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PLANCATEGORY_EDIT",
    component: PlanCategoryEdit,
  },
  {
    path: "/plan-category/delete/:id",
    exact: true,
    name: "Xóa",
    function: "MD_PLANCATEGORY_DEL",
    component: PlanCategoryDelete,
  },
  //.end#Plan category

  // // Plan
  {
    path: "/plan",
    exact: true,
    name: "Danh sách dự án",
    function: "MD_PLAN_VIEW",
    component: Plan,
  },
  {
    path: "/plan/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PLAN_ADD",
    component: PlanAdd,
  },
  {
    path: "/plan/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PLAN_VIEW",
    component: PlanDetail,
  },
  {
    path: "/plan/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PLAN_EDIT",
    component: PlanEdit,
  },
  // { path: '/plan/delete/:id', exact: true, name: 'Xóa', function: 'MD_PLAN_DEL', component: PlanDelete },
  // //.end#Plan

  // // Contact cusomer
  {
    path: "/contact-customer",
    exact: true,
    name: "Danh sách khách hàng liên hệ",
    function: "CRM_CONTACTCUSTOMER_VIEW",
    component: ContactCustomer,
  },
  // { path: '/contact-customer/add', exact: true, name: 'Thêm mới', function: 'MD_CONTACT_CUSTOMER_ADD', component: ContactCustomerAdd },
  {
    path: "/contact-customer/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_CONTACTCUSTOMER_VIEW",
    component: ContactCustomerDetail,
  },
  // { path: '/contact-customer/edit/:id', exact: true, name: 'Chỉnh sửa', function: 'MD_CONTACT_CUSTOMER_EDIT', component: ContactCustomerEdit }
  // //.end#Contact cusomer

  //publishing company
  {
    path: "/publishing-company",
    exact: true,
    name: "Danh sách nhà xuất bản",
    function: "MD_PUBLISHINGCOMPANY_VIEW",
    component: PublishingCompany,
  },
  {
    path: "/publishing-company/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PUBLISHINGCOMPANY_ADD",
    component: PublishingCompanyAdd,
  },
  {
    path: "/publishing-company/edit/:id",
    exact: true,
    name: "Tạo mới",
    function: "MD_PUBLISHINGCOMPANY_EDIT",
    component: PublishingCompanyEdit,
  },
  {
    path: "/publishing-company/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PUBLISHINGCOMPANY_VIEW",
    component: PublishingCompanyDetail,
  },
  {
    path: "/comment-rating",
    exact: true,
    name: "Danh sách bình luận",
    function: "CRM_COMMENTRATING_VIEW",
    component: CommentRating,
  },

  // service
  {
    path: "/service",
    exact: true,
    name: "Danh sách dịch vụ",
    function: "MD_SERVICE_VIEW",
    component: Service,
  },
  {
    path: "/service/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_SERVICE_ADD",
    component: ServiceAdd,
  },
  {
    path: "/service/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_SERVICE_VIEW",
    component: ServiceDetail,
  },
  {
    path: "/service/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_SERVICE_EDIT",
    component: ServiceEdit,
  },
  // end#service

  // Faq
  {
    path: "/faq",
    exact: true,
    name: "Danh sách câu hỏi",
    function: "CMS_FAQ_VIEW",
    component: Faq,
  },
  {
    path: "/faq/add",
    exact: true,
    name: "Thêm mới",
    function: "CMS_FAQS_ADD",
    component: FaqAdd,
  },
  {
    path: "/faq/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CMS_FAQS_VIEW",
    component: FaqDetail,
  },
  {
    path: "/faq/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CMS_FAQS_EDIT",
    component: FaqEdit,
  },
  // end#Faq
  // PageSetting
  {
    path: "/page-setting",
    exact: true,
    name: "Cài đặt trang web",
    function: "SYS_APPCONFIG_VIEW",
    component: PageSetting,
  },
  // end#PageSeting

  // Partner
  {
    path: "/partner",
    exact: true,
    name: "Danh sách đối tác",
    function: "MD_PARTNER_VIEW",
    component: Partner,
  },
  {
    path: "/partner/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PARTNER_ADD",
    component: PartnerAdd,
  },
  {
    path: "/partner/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PARTNER_VIEW",
    component: PartnerDetail,
  },
  {
    path: "/partner/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PARTNER_EDIT",
    component: PartnerEdit,
  },
  // end#Partner
  // Review
  {
    path: "/review",
    exact: true,
    name: "Dánh sách đánh giá",
    function: "CRM_REVIEW_VIEW",
    component: Review,
  },
  {
    path: "/review/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_REVIEW_ADD",
    component: ReviewAdd,
  },
  {
    path: "/review/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_REVIEW_VIEW",
    component: ReviewDetail,
  },
  {
    path: "/review/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_REVIEW_EDIT",
    component: ReviewEdit,
  },
  // end#Review
  // Review
  {
    path: "/position",
    exact: true,
    name: "Chức vụ",
    function: "MD_POSITION_VIEW",
    component: Position,
  },
  {
    path: "/position/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_POSITION_ADD",
    component: PositionAdd,
  },
  // {
  //   path: "/review/detail/:id",
  //   exact: true,
  //   name: "Chi tiết",
  //   function: "MD_POSITION_VIEW",
  //   component: ReviewDetail,
  // },
  {
    path: "/position/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_POSITION_EDIT",
    component: PositonEdit,
  },
  // end#Review
  // MainNumber
  {
    path: "/main-number",
    exact: true,
    name: "Danh sách giá trị",
    function: "FOR_MAINNUMBER_VIEW",
    component: MainNumber,
  },
  {
    path: "/main-number/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_MAINNUMBER_ADD",
    component: MainNumberAdd,
  },
  {
    path: "/main-number/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_MAINNUMBER_VIEW",
    component: MainNumberDetail,
  },
  {
    path: "/main-number/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_MAINNUMBER_EDIT",
    component: MainNumberEdit,
  },
  // end#MainNumber

  //Attributes
  {
    path: "/attributes",
    exact: true,
    name: "Danh sách thuộc tính",
    function: "FOR_ATTRIBUTES_VIEW",
    component: Attributes,
  },
  {
    path: "/attributes/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_ATTRIBUTES_ADD",
    component: AttributesAdd,
  },
  {
    path: "/attributes/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_ATTRIBUTES_VIEW",
    component: AttributesDetail,
  },
  {
    path: "/attributes/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_ATTRIBUTES_EDIT",
    component: AttributesEdit,
  },
  // end#Attributes

  //Calculation
  {
    path: "/calculation",
    exact: true,
    name: "Danh sách phép tính",
    function: "MD_CALCULATION_VIEW",
    component: Calculation,
  },
  {
    path: "/calculation/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_CALCULATION_ADD",
    component: CalculationAdd,
  },
  {
    path: "/calculation/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_CALCULATION_VIEW",
    component: CalculationDetail,
  },
  {
    path: "/calculation/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_CALCULATION_EDIT",
    component: CalculationEdit,
  },
  // end#Calculation

  //Letter
  {
    path: "/letter",
    exact: true,
    name: "Bảng chữ cái",
    function: "MD_LETTER_VIEW",
    component: Letter,
  },
  {
    path: "/letter/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_LETTER_ADD",
    component: LetterAdd,
  },
  {
    path: "/letter/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_LETTER_VIEW",
    component: LetterDetail,
  },
  {
    path: "/letter/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_LETTER_EDIT",
    component: LetterEdit,
  },
  // end#Letter

  //ParamName
  {
    path: "/param-name",
    exact: true,
    name: "Danh sách biến số tên",
    function: "MD_PARAMNAME_VIEW",
    component: ParamName,
  },
  {
    path: "/param-name/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PARAMNAME_ADD",
    component: ParamNameAdd,
  },
  {
    path: "/param-name/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PARAMNAME_VIEW",
    component: ParamNameDetail,
  },
  {
    path: "/param-name/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PARAMNAME_EDIT",
    component: ParamNameEdit,
  },
  // end#ParamName

  //AttributesGroup
  {
    path: "/attributes-group",
    exact: true,
    name: "Danh sách chỉ số",
    function: "FOR_ATTRIBUTESGROUP_VIEW",
    component: AttributesGroup,
  },
  {
    path: "/attributes-group/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_ATTRIBUTESGROUPE_ADD",
    component: AttributesGroupAdd,
  },
  {
    path: "/attributes-group/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_ATTRIBUTESGROUP_VIEW",
    component: AttributesGroupDetail,
  },
  {
    path: "/attributes-group/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_ATTRIBUTESGROUP_EDIT",
    component: AttributesGroupEdit,
  },
  // end#AttributesGroup

  //param-type
  {
    path: "/param-dob",
    exact: true,
    name: "Danh sách biến số ngày sinh",
    function: "MD_PARAMDOB_VIEW",
    component: ParamDob,
  },
  {
    path: "/param-dob/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_PARAMDOB_ADD",
    component: ParamDobAdd,
  },
  {
    path: "/param-dob/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_PARAMDOB_VIEW",
    component: ParamDobDetail,
  },
  {
    path: "/param-dob/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_PARAMDOB_EDIT",
    component: ParamDobEdit,
  },
  // end#param-type

  //formula
  {
    path: "/formula-by-dob",
    exact: true,
    name: "Danh sách công thức theo ngày sinh",
    function: "FOR_FORMULABYDOB_VIEW",
    component: FormulaByDob,
  },
  {
    path: "/formula-by-dob/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_FORMULABYDOB_ADD",
    component: FormulaByDobAdd,
  },
  {
    path: "/formula-by-dob/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_FORMULABYDOB_VIEW",
    component: FormulaByDobDetail,
  },
  {
    path: "/formula-by-dob/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_FORMULABYDOB_EDIT",
    component: FormulaByDobEdit,
  },
  // end#formula

  //formula-by-name
  {
    path: "/formula-by-name",
    exact: true,
    name: "Danh sách công thức theo tên",
    function: "FOR_FORMULABYNAME_VIEW",
    component: FormulaByName,
  },
  {
    path: "/formula-by-name/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_FORMULABYNAME_ADD",
    component: FormulaByNameAdd,
  },
  {
    path: "/formula-by-name/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_FORMULABYNAME_VIEW",
    component: FormulaByNameDetail,
  },
  {
    path: "/formula-by-name/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_FORMULABYNAME_EDIT",
    component: FormulaByNameEdit,
  },
  // end#formula-by-name

  //relationShips
  {
    path: "/relationShips",
    exact: true,
    name: "Danh sách mối quan hệ",
    function: "MD_RELATIONSHIPS_VIEW",
    component: RelationShips,
  },
  {
    path: "/relationShips/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_RELATIONSHIPS_ADD",
    component: RelationShipsAdd,
  },
  {
    path: "/relationShips/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_RELATIONSHIPS_VIEW",
    component: RelationShipsDetail,
  },
  {
    path: "/relationShips/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_RELATIONSHIPS_EDIT",
    component: RelationShipsEdit,
  },
  // end#relationShips

  //ProductCombo
  {
    path: "/product-combo",
    exact: true,
    name: "Danh sách Combo",
    function: "PRO_COMBOS_VIEW",
    component: ProductCombo,
  },
  {
    path: "/product-combo/add",
    exact: true,
    name: "Thêm mới",
    function: "PRO_COMBOS_ADD",
    component: ProductComboAdd,
  },
  {
    path: "/product-combo/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "PRO_COMBOS_VIEW",
    component: ProductComboDetail,
  },
  {
    path: "/product-combo/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "PRO_COMBOS_EDIT",
    component: ProductComboEdit,
  },
  // end#ProductCombo
  //interpret
  {
    path: "/interpret",
    exact: true,
    name: "Danh sách luận giải",
    function: "FOR_INTERPRET_VIEW",
    component: InterPret,
  },
  {
    path: "/interpret/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_INTERPRET_ADD",
    component: InterPretAdd,
  },
  {
    path: "/interpret/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_INTERPRET_VIEW",
    component: InterPretDetail,
  },
  {
    path: "/interpret/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_INTERPRET_EDIT",
    component: InterPretEdit,
  },
  {
    path: "/interpret/detail-web/:id",
    exact: true,
    // name: "Chi tiết",
    function: "SL_INTERPRET_VIEW",
    component: InterPretView,
  },
  {
    path: "/interpret/copy/:id",
    exact: true,
    name: "Sao chép",
    function: "FOR_INTERPRET_EDIT",
    component: InterPretCopy,
  },
  // end#interpret

  //InterPretChild
  // {
  //   path: "/interpret/interpret-detail/:id",
  //   exact: true,
  //   name: "Danh sách luận giải chi tiết",
  //   function: "FOR_INTERPRET_DETAIL_VIEW",
  //   component: InterPretChild,
  // },
  {
    path: "/interpret/d-add/:id",
    exact: true,
    name: "Thêm mới",
    function: "FOR_INTERPRET_DETAIL_ADD",
    component: InterPretChildAdd,
  },
  {
    path: "/interpret/d-detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_INTERPRET_DETAIL_VIEW",
    component: InterPretChildDetail,
  },
  {
    path: "/interpret/d-edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_INTERPRET_DETAIL_EDIT",
    component: InterPretChildEdit,
  },
  // end#InterPretChild
  //order
  {
    path: "/order",
    exact: true,
    name: "Danh sách đơn hàng",
    function: "SL_ORDER_VIEW",
    component: Order,
  },
  {
    path: "/order/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SL_ORDER_VIEW",
    component: OrderDetail,
  },

  // end#order

  // searchHistory
  {
    path: "/search-history",
    exact: true,
    name: "Danh sách tra cứu lịch sử khách hàng",
    function: "CUS_SEARCH_HISTORY_VIEW",
    component: SearchHistory,
  },
  {
    path: "/search-history/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CUS_SEARCH_HISTORY_VIEW",
    component: SearchHistoryDetail,
  },
  //end searchHistory
  //formula-ingredients
  {
    path: "/formula-ingredients",
    exact: true,
    name: "Danh sách thành phần",
    function: "FOR_FORMULAINGREDIENTS_VIEW",
    component: FormulaIngredients,
  },
  {
    path: "/formula-ingredients/add",
    exact: true,
    name: "Thêm mới",
    function: "FOR_FORMULAINGREDIENTS_ADD",
    component: FormulaIngredientsAdd,
  },
  {
    path: "/formula-ingredients/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "FOR_FORMULAINGREDIENTS_VIEW",
    component: FormulaIngredientsDetail,
  },
  {
    path: "/formula-ingredients/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "FOR_FORMULAINGREDIENTS_EDIT",
    component: FormulaIngredientsEdit,
  },
  // end#FormulaIngredients
    //Formula
    {
      path: "/formula",
      exact: true,
      name: "Danh sách công thức",
      function: "FOR_FORMULA_VIEW",
      component: Formula,
    },
    {
      path: "/formula/add",
      exact: true,
      name: "Thêm mới",
      function: "FOR_FORMULA_ADD",
      component: FormulaAdd,
    },
    {
      path: "/formula/detail/:id",
      exact: true,
      name: "Chi tiết",
      function: "FOR_FORMULA_VIEW",
      component: FormulaDetail,
    },
    {
      path: "/formula/edit/:id",
      exact: true,
      name: "Chỉnh sửa",
      function: "FOR_FORMULA_EDIT",
      component: FormulaEdit,
    },
    // end#Formula
];

export default routes;
