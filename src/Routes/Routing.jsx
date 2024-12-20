import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../pages/Home";
import ManageUser from "../pages/ManageUser";
import ManageAssesment from "../pages/ManageAssesment";
import ManageAvoidFood from "../pages/ManageAvoidFood";
import ManageVideos from "../pages/ManageVideos";
import ManagePosts from "../pages/ManagePosts";
import ManageFAQ from "../pages/ManageFAQ";
import ManageSubscription from "../pages/ManageSubscription";
import ManageBlog from "../pages/ManageBlog";
import ManageExpert from "../pages/ManageExpert";
import ManageComment from "../pages/ManageComment";
import ManageDoses from "../pages/ManageDoses";
import ManageAdvertise from "../pages/ManageAdvertise";
import ManageReport from "../pages/ManageReport";
import Diet from "../pages/ManageSchedule/Diet";
import Exercise from "../pages/ManageSchedule/Exercise";
import Medical from "../pages/ManageSchedule/Medical";
import Medication from "../pages/ManageSchedule/Medication";
import Vaccination from "../pages/ManageSchedule/Vaccination";
// import Login from "../Dashboard/Login";
import Signin from "../Dashboard/signin";
// import PNDiet from "../PostNatal/PostNatalDiet"
// import PNExercise from "../PostNatal/PostNatalExercise"
// import PNPrecaution from "../PostNatal/PostNatalPrecaution";
// import PNMedication from "../PostNatal/PostNatalMedication";
// import PNVaccination from "../PostNatal/PostNatalVaccination"
import MedicalCondition from "../pages/MedicalCondition";
import ManageTags from "../pages/ManageTags";
import PlanMaster from "../pages/PlanMaster/PlanMaster";
import Precaution from "../pages/ManageSchedule/Precaution";
import PostNatal from "../PostNatal/PostNatal";
import ManageBanner from "../pages/ManageBanner";
import MedDetils from "../pages/ManageSchedule/MedDetails";

export default function Routing() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="manage-schedule/diet" element={<Diet />} />
            <Route path="manage-schedule/exercise" element={<Exercise />} />
            <Route path="manage-schedule/medical" element={<Medical />} />
            <Route path="manage-schedule/MedDetils" element={<MedDetils/>} />
            <Route path="manage-schedule/medication" element={<Medication />} />
            <Route path="manage-schedule/precaution" element={<Precaution />} />
            <Route
              path="manage-schedule/vaccination"
              element={<Vaccination />}
            />
            <Route path="post-natal" element={<PostNatal/>} />
            {/* <Route path="post-natal/pndiet" element={<PNDiet />} />
            <Route path="post-natal/pnexercise" element={<PNExercise />} />
            <Route path="post-natal/pnprecaution" element={<PNPrecaution />} />
            <Route path="post-natal/pnmedication" element={<PNMedication />} />
            <Route path="post-natal/pnvaccination" element={<PNVaccination />}/> */}

            <Route path="manage-assesment" element={<ManageAssesment />} />
            <Route path="manage-avoid-food" element={<ManageAvoidFood />} />
            <Route path="plan-master" element={<PlanMaster />} />
            <Route path="manage-videos" element={<ManageVideos />} />
            <Route path="manage-posts" element={<ManagePosts />} />
            <Route path="manage-faq" element={<ManageFAQ />} />
            <Route
              path="manage-subscription"
              element={<ManageSubscription />}
            />
            <Route path="manage-blog" element={<ManageBlog />} />
            <Route path="manage-expert" element={<ManageExpert />} />
            <Route path="manage-comments" element={<ManageComment />} />
            <Route path="manage-doses" element={<ManageDoses />} />
            <Route path="manage-tags" element={<ManageTags />} />
            <Route path="manage-advertise" element={<ManageAdvertise />} />
            <Route path="manage-report" element={<ManageReport />} />
            <Route path="medical-condition" element={<MedicalCondition />} />
            <Route path="manage-banner" element={<ManageBanner/>}/>
            {/* <Route path="login" element={<Login />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
