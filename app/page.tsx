'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FolderKanban, Link2, FileDown, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Shield, Zap, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Organize and track all your development projects with detailed information, tech stacks, and timelines.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Link2,
      title: 'Account Integration',
      description: 'Connect your Gmail and GitHub accounts to streamline project management and collaboration.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileDown,
      title: 'Export & Share',
      description: 'Generate professional CSV exports for resumes, portfolios, and job applications instantly.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Track your progress, skills, and achievements to showcase your professional development journey.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Tech Stack Library',
      description: 'Maintain a comprehensive library of technologies and frameworks you\'ve worked with.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  const benefits = [
    'Never lose track of your projects again',
    'Build impressive portfolios effortlessly',
    'Export data for job applications in seconds',
    'Showcase your tech stack expertise',
    'Manage multiple accounts seamlessly',
    'Track your career progression',
  ];

  const stats = [
    { icon: FolderKanban, value: '500+', label: 'Projects Tracked' },
    { icon: Users, value: '1000+', label: 'Developers' },
    { icon: FileDown, value: '5000+', label: 'Exports Generated' },
    { icon: Award, value: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/horizantal-logo-devtrack.png"
                alt="DevTrack Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-6 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 relative">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Track Your Development Journey
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight animate-fade-in-up">
              Manage Projects.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">
                Build Your Portfolio.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              The ultimate platform for developers to track projects, manage accounts, and export professional experience for resumes and job applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center gap-2 group hover:scale-105 transform"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-all shadow-sm hover:shadow font-semibold text-lg hover:scale-105 transform"
              >
                View Demo
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-6 animate-fade-in-up animation-delay-600">
              No credit card required • Free forever • 2 minutes setup
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-lg backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float animation-delay-2000">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full backdrop-blur-sm" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-3 group-hover:bg-indigo-600 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed specifically for developers to manage and showcase their work
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-transparent hover:-translate-y-2 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Why Developers Choose DevTrack
                </h2>
                <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                  Join thousands of developers who are already managing their projects and building impressive portfolios with DevTrack.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-lg text-indigo-50">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="space-y-6">
                  {stats.slice(0, 3).map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 group hover:scale-105 transition-transform duration-300"
                      >
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold">{stat.value}</div>
                          <div className="text-indigo-200">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Get Started in Minutes
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Track Your Development Journey?
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Join DevTrack today and take control of your project portfolio. Start building your professional presence.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg group hover:scale-105 transform"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/icon-devtrack.png"
                alt="DevTrack Icon"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-white font-semibold">DevTrack</span>
            </div>
            <div className="text-sm">
              © 2024 DevTrack. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
